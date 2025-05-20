from flask import Flask, request, jsonify
from utils.encryption import encrypt, hash_email, decrypt
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from flask_pymongo import PyMongo
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
from flask_cors import CORS
import datetime

# Load environment variables from the .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure app settings using environment variables
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # Your secret key for JWT
app.config["MONGO_URI"] = os.getenv("MONGO_URI")            # MongoDB connection string
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)    # Access tokens expire in 1 hour
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)     # Refresh tokens expire in 30 days


# Initialize JWT Manager and PyMongo
jwt = JWTManager(app)
mongo = PyMongo(app)
users_collection = mongo.db.users  # Define the collection to store users

# Initialize Flask-Limiter with default limits
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    # Comment out default limits for development
    # default_limits=["200 per day", "50 per hour"]
)


# Enable CORS for the Flask app
backend_url = os.getenv("FLASK_BACKEND_URL")
frontend_url = os.getenv("REACT_FRONTEND_URL")
CORS(app, resources={r"/*": {"origins": [frontend_url, backend_url]}})

# Signup Endpoint: Register a new user (Limit to 5 attempts per minute per IP)
@app.route('/signup', methods=['POST'])
# Comment out rate limit for development
# @limiter.limit("5 per minute")
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not username or not email or not password:
        return jsonify({"msg": "Missing username, email, or password"}), 400

    # deterministic hash for email lookup
    emailHash = hash_email(email)

    # Check if the user already exists using email_hash
    if users_collection.find_one({"emailHash": emailHash}):
        return jsonify({"msg": "User already exists"}), 409

    # Hash the user's password before saving
    hashed_password = generate_password_hash(password)

    encrypted_email = encrypt(email)

    # Create a user document
    user = {
        "username": username,
        "email": encrypted_email,
        "emailHash": emailHash,
        "password": hashed_password
    }

    # Insert the new user into the database
    users_collection.insert_one(user)
    return jsonify({"msg": "User created successfully"}), 201

# Login Endpoint: Authenticate user and return JWT token (Limit to 10 attempts per minute per IP)
@app.route('/api/users/login', methods=['POST'])
# @limiter.limit("10 per minute")  # Uncomment for production
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Validate input
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    emailHash = hash_email(email)

    # Find the user in the database
    user = users_collection.find_one({"emailHash": emailHash})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Create tokens
    access_token = create_access_token(identity=str(user['_id']))
    
    # Create user object to return (similar to what Node.js backend returns)
    user_data = {
        "_id": str(user['_id']),
        "email": email,  # Use original email since it's encrypted in DB
        "name": user.get('name', ''),
        "role": user.get('role', 'consumer'),
        "age": user.get('age', ''),
        "contact_no": user.get('contact_no', ''),
        "providerDetails": user.get('providerDetails', {}),
        "consumerDetails": user.get('consumerDetails', {})
    }
    
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": user_data
    }), 200

# Registration Endpoint: Register a new user and return JWT token (Limit to 5 attempts per minute per IP)
@app.route('/api/users/register', methods=['POST'])
# @limiter.limit("5 per minute")  # Uncomment for production
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Validate input
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Hash email for lookup
    emailHash = hash_email(email)
    
    # Check if user exists
    if users_collection.find_one({"emailHash": emailHash}):
        return jsonify({"error": "User already exists"}), 400
    
    # Create new user document
    encrypted_email = encrypt(email)
    hashed_password = generate_password_hash(password)
    
    user = {
        "email": encrypted_email,
        "emailHash": emailHash,
        "password": hashed_password,
        "role": "consumer",
        "createdAt": datetime.datetime.utcnow()
    }
    
    result = users_collection.insert_one(user)
    
    # Generate token
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        "message": "User registered successfully", 
        "token": access_token
    }), 201

# Protected Route: Accessible only with a valid JWT token
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    return jsonify({"msg": "This is a protected route"}), 200

# Refresh Route
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    # The current identity is extracted from the refresh token
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200


# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
