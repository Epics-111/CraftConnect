from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from utils.encryption import encrypt, decrypt, hash_email
from bson.objectid import ObjectId
import traceback
from app import users_collection, app  # Import the collection
from flask_cors import CORS
from datetime import timedelta

# Initialize CORS for the auth blueprint
auth_bp = Blueprint('auth', __name__)
CORS(auth_bp, resources={r"/api/*": {"origins": "*"}})

# Signup Endpoint: Register a new user (Limit to 5 attempts per minute per IP)
@auth_bp.route('/register', methods=['POST'])
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
@auth_bp.route('/login', methods=['POST'])
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

    # Create tokens with expiration times
    access_token = create_access_token(
        identity=str(user['_id']), 
        expires_delta=timedelta(hours=1)  # Access token expires in 1 hour
    )
    refresh_token = create_refresh_token(
        identity=str(user['_id']),
        expires_delta=timedelta(days=30)  # Refresh token expires in 30 days
    )
    
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
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    return jsonify({"msg": "This is a protected route"}), 200

# Refresh Route
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(
        identity=current_user,
        expires_delta=timedelta(hours=1)  # New access token expires in 1 hour
    )
    
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

# Save User Details Endpoint: Update user information
@auth_bp.route('/save-details', methods=['POST'])
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
