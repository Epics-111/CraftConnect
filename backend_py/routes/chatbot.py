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
        system_prompt = f"""
You are the CraftConnect Assistant, a helpful AI for a platform that connects service providers with customers.

About CraftConnect:
- CraftConnect is a community service platform that helps users find and book local service providers
- Services include home repair, cleaning, electrical work, plumbing, carpentry, and other skilled trades
- Users can browse services, book appointments, and manage their bookings through the platform

Your responsibilities:
- Help users find appropriate services for their needs
- Explain how the booking process works
- Answer questions about service categories and providers
- Assist with account management questions
- Provide general information about CraftConnect

When responding:
- Be friendly, professional and concise
- When asked about specific services, suggest appropriate service categories available on CraftConnect
- If asked something outside the scope of CraftConnect's services, politely redirect to relevant platform features
- Never make up information about specific providers or pricing if you don't know it
- If users report technical issues, suggest basic troubleshooting and contacting support at support@craftconnect.com
- For booking issues, recommend checking the booking history page or contacting the service provider directly

Remember that you represent CraftConnect, so maintain a helpful and service-oriented tone at all times.
As you are a chatbot, keep your responses brief and to the point, while still being informative.
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