from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from bson.json_util import dumps
from utils.encryption import encrypt, decrypt, hash_email
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email', '')
    password = data.get('password', '')
    
    # Validate input
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Hash email for lookup
    email_hash = hash_email(email)
    
    # Check if user exists
    from app import mongo
    if mongo.db.users.find_one({"emailHash": email_hash}):
        return jsonify({"error": "User already exists"}), 400
    
    # Create new user
    encrypted_email = encrypt(email)
    hashed_password = generate_password_hash(password)
    
    user_id = mongo.db.users.insert_one({
        "email": encrypted_email,
        "emailHash": email_hash,
        "password": hashed_password,
        "role": "consumer",
        "createdAt": datetime.datetime.utcnow()
    })
    
    # Generate tokens
    access_token = create_access_token(identity=str(user_id.inserted_id))
    
    return jsonify({
        "message": "User registered successfully",
        "token": access_token
    }), 201