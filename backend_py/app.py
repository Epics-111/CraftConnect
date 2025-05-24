from flask import Flask
from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables first
load_dotenv()

# Get frontend URL from environment, with fallback
frontend_url = os.getenv("REACT_FRONTEND_URL", "http://localhost:3000")

# Initialize Flask app
app = Flask(__name__)

# Configure app settings BEFORE initializing extensions
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # Your secret key for JWT
app.config["MONGO_URI"] = os.getenv("MONGO_URI")           # MongoDB connection string
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)    # Access tokens expire in 1 hour
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)   # Refresh tokens expire in 30 days

# Enhanced CORS setup
CORS(app, resources={
    r"/api/*": {
        "origins": [frontend_url],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
        "supports_credentials": True
    }
})

# Initialize extensions
jwt = JWTManager(app)
mongo = PyMongo(app)
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Create a users_collection reference for other modules to use
users_collection = mongo.db.users

# Import blueprints AFTER initializing extensions to avoid circular imports
from routes.auth import auth_bp
from routes.services import services_bp
from routes.bookings import bookings_bp  # Add this line
from routes.chatbot import chatbot_bp

# Register blueprints with URL prefixes
app.register_blueprint(auth_bp, url_prefix='/api/users')
app.register_blueprint(services_bp, url_prefix='/api/services')
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')  # Add this line
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
# app.register_blueprint(user_bp, url_prefix='/api/user-details')
# Add more blueprints as needed

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)