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

# Load environment variables from the .env file
load_dotenv()


# Initialize Flask-Limiter with default limits
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)


# Enable CORS for the Flask app
backend_url = os.getenv("FLASK_BACKEND_URL")
frontend_url = os.getenv("REACT_FRONTEND_URL")
CORS(app, resources={r"/*": {"origins": [frontend_url, backend_url]}})
app = Flask(__name__)
# Set the frontend URL from environment variable

# Configure app settings using environment variables
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # Your secret key for JWT
app.config["MONGO_URI"] = os.getenv("MONGO_URI")            # MongoDB connection string
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)    # Access tokens expire in 1 hour
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)     # Refresh tokens expire in 30 days


# Initialize JWT Manager and PyMongo
jwt = JWTManager(app)
mongo = PyMongo(app)
users_collection = mongo.db.users  # Define the collection to store users

# Signup Endpoint: Register a new user (Limit to 5 attempts per minute per IP)
@app.route('/signup', methods=['POST'])
@limiter.limit("5 per minute")
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
@app.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email, password)

    # Validate input
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    emailHash = hash_email(email)

    # Find the user in the database
    user = users_collection.find_one({"emailHash": emailHash})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"msg": "Invalid credentials"}), 401

    # Create an access token with the user's unique identifier
    access_token = create_access_token(identity=str(user['_id']))
    refresh_token = create_refresh_token(identity=str(user['_id']))
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200

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
