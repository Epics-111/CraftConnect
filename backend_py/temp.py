from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Connect to MongoDB Atlas
try:
    mongo_uri = os.getenv("MONGO_URI")
    print(f"Connecting to MongoDB with URI: {mongo_uri}")
    client = MongoClient(mongo_uri)
    db = client['test']
    users_collection = db['users']
    print("MongoDB connected successfully.")
except Exception as e:
    print(f"MongoDB connection error: {e}")
    exit()

@app.route('/login', methods=['POST'])
def login():
    print("Login endpoint hit")
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = users_collection.find_one({"email": email})
    print(f"User found: {user}")

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "user": {"email": user["email"]}}), 200

@app.route('/api/users/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({"email": email, "password": hashed_password})
    
    return jsonify({"message": "User registered successfully"}), 201


if __name__ == '__main__':
    app.run(debug=True)
