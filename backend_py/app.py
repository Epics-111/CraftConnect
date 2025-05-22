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
from bson.objectid import ObjectId
import traceback  # For better error logging

load_dotenv()

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)
CORS(app, origins=[os.getenv("REACT_FRONTEND_URL")])  # or your frontend domain

# Initialize Flask-Limiter with default limits
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

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
@app.route('/api/users/register', methods=['POST'])
# @limiter.limit("5 per minute")
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({"msg": "Missing email, or password"}), 400

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
        "email": encrypted_email,
        "emailHash": emailHash,
        "password": hashed_password
    }

    # Insert the new user into the database
    users_collection.insert_one(user)
    return jsonify({"msg": "User created successfully"}), 201

# Login Endpoint: Authenticate user and return JWT token (Limit to 10 attempts per minute per IP)
@app.route('/api/users/login', methods=['POST'])
# @limiter.limit("10 per minute")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

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
    
    # Prepare user data for frontend - send the entire user schema
    user_data = {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": decrypt(user.get("email")) if user.get("email") else None,
        "age": user.get("age"),
        "contact_no": user.get("contact_no"),
        "role": user.get("role"),
    }
    
    # Add role-specific details if they exist
    if user.get("role") == "provider" and user.get("providerDetails"):
        user_data["providerDetails"] = user.get("providerDetails")
    elif user.get("role") == "consumer" and user.get("consumerDetails"):
        user_data["consumerDetails"] = user.get("consumerDetails")
    
    return jsonify({
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "user": user_data
    }), 200

# Protected Route: Accessible only with a valid JWT token
@app.route('/api/users/profile', methods=['GET'])
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
    
    # Get the updated user information
    user = users_collection.find_one({"_id": ObjectId(current_user)})
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    # Prepare user data for frontend
    user_data = {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": decrypt(user.get("email")) if user.get("email") else None,
        "age": user.get("age"),
        "contact_no": user.get("contact_no"),
        "role": user.get("role"),
    }
    
    # Add role-specific details if they exist
    if user.get("role") == "provider" and user.get("providerDetails"):
        user_data["providerDetails"] = user.get("providerDetails")
    elif user.get("role") == "consumer" and user.get("consumerDetails"):
        user_data["consumerDetails"] = user.get("consumerDetails")
        
    return jsonify({
        "access_token": new_access_token,
        "user": user_data
    }), 200

@app.route('/api/user-details/save-details', methods=['POST'])
@jwt_required()
def save_user_details():
    try:
        # Check for valid JSON first
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400

        # Get user ID from JWT token
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate user_id is a valid ObjectId
        try:
            user_object_id = ObjectId(user_id)
        except Exception:
            return jsonify({"msg": "Invalid user ID"}), 400

        # Extract fields with proper validation
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        age = data.get('age')
        contact_no = data.get('contact_no')
        role = data.get('role')

        # Build the update document with only the fields that are provided
        user_update = {}
        
        if name is not None:
            user_update["name"] = name
        
        if email is not None:
            # Handle email update
            user_update["email"] = encrypt(email)
            user_update["emailHash"] = hash_email(email)
        
        if password is not None:
            user_update["password"] = generate_password_hash(password)
            
        if age is not None:
            user_update["age"] = age
            
        if contact_no is not None:
            user_update["contact_no"] = contact_no
            
        if role is not None:
            user_update["role"] = role
            
        # Handle role-specific details
        if role == "provider" and data.get('providerDetails') is not None:
            user_update["providerDetails"] = data.get('providerDetails')
        elif role == "consumer" and data.get('consumerDetails') is not None:
            user_update["consumerDetails"] = data.get('consumerDetails')

        # Only perform update if there are fields to update
        if not user_update:
            return jsonify({"msg": "No valid fields to update"}), 400

        # Update the user document
        result = users_collection.update_one(
            {"_id": user_object_id},
            {"$set": user_update}
        )

        if result.matched_count == 0:
            return jsonify({"msg": "User not found"}), 404

        # Fetch the updated user document to return
        updated_user = users_collection.find_one({"_id": user_object_id})
        if not updated_user:
            return jsonify({"msg": "User found but could not retrieve updated data"}), 500
            
        # Prepare user data for frontend
        user_data = {
            "id": str(updated_user["_id"]),
            "name": updated_user.get("name"),
            "email": decrypt(updated_user.get("email")) if updated_user.get("email") else None,
            "age": updated_user.get("age"),
            "contact_no": updated_user.get("contact_no"),
            "role": updated_user.get("role"),
        }
        
        # Add role-specific details if they exist
        if updated_user.get("role") == "provider" and updated_user.get("providerDetails"):
            user_data["providerDetails"] = updated_user.get("providerDetails")
        elif updated_user.get("role") == "consumer" and updated_user.get("consumerDetails"):
            user_data["consumerDetails"] = updated_user.get("consumerDetails")

        return jsonify({
            "msg": "User details updated successfully", 
            "user": user_data
        }), 200

    except Exception as e:
        # Log the full error stack for debugging
        app.logger.error(f"Error in save_user_details: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500


# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)