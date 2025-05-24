from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import CORS
import google.generativeai as genai
import os
from app import app

# Initialize chatbot blueprint
chatbot_bp = Blueprint('chatbot', __name__)
CORS(chatbot_bp, resources={r"/api/*": {"origins": "*"}})

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({"msg": "Message is required"}), 400
        
        # Define contextual instructions for the AI
        system_prompt = """
        You are a virtual assistant for a smart community service access platform. 
        Your purpose is to help users with questions related to community services such as 
        local events, public transportation, utility services, and community resources. 
        If a question is unrelated to these topics, politely inform the user that you can 
        only assist with community service-related inquiries.
        """
        
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate content with the system prompt and user message
        response = model.generate_content([system_prompt, message])
        
        # Extract the response text
        reply = response.text if response else "I'm here to assist with community service inquiries. How can I help you today?"
        
        return jsonify({"reply": reply}), 200
        
    except Exception as e:
        app.logger.error(f"Chatbot API Error: {str(e)}")
        return jsonify({"msg": "Failed to generate response", "error": str(e)}), 500