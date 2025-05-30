from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
from ..models.request_models import IntentRequest, ChatRequest
from ..services import intent_detection, tools
from ..services.intent_detection import detect_intent
import json

# Initialize agent blueprint
agent_bp = Blueprint('agent', __name__)
CORS(agent_bp, resources={r"/api/*": {"origins": "*"}})

@agent_bp.route('/handle-intent', methods=['POST'])
@jwt_required(optional=True)  # Make JWT optional for flexibility
def handle_intent():
    """Handle user intents and route to appropriate tools"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        intent = data.get("intent")
        params = data.get("parameters", {})
        
        # Get user token if available
        token = None
        user_id = None
        try:
            user_id = get_jwt_identity()
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
        except:
            pass  # JWT not required for all operations
        
        if not intent:
            return jsonify({"error": "Missing 'intent' field"}), 400

        # Route to appropriate tool based on intent
        if intent == "find_services_by_title":
            title = params.get("title")
            if not title:
                return jsonify({"error": "Missing 'title' parameter"}), 400
            result = tools.find_services_by_title(title)
            
        elif intent == "get_service_details":
            service_id = params.get("service_id")
            if not service_id:
                return jsonify({"error": "Missing 'service_id' parameter"}), 400
            result = tools.get_service_details(service_id)
            
        elif intent == "find_nearby_services":
            lat = params.get("lat")
            lng = params.get("lng")
            radius = params.get("radius", 5)
            if lat is None or lng is None:
                return jsonify({"error": "Missing 'lat' or 'lng' parameter"}), 400
            result = tools.find_nearby_services(float(lat), float(lng), float(radius))
            
        elif intent == "create_booking":
            required = ["service_id", "client_name", "client_email", "booking_date", "contact_number"]
            for r in required:
                if r not in params:
                    return jsonify({"error": f"Missing '{r}' parameter"}), 400
            result = tools.create_booking(
                params["service_id"],
                params["client_name"],
                params["client_email"],
                params["booking_date"],
                params["contact_number"],
                params.get("special_instructions", ""),
                token
            )
            
        elif intent == "get_booking_history":
            # Use JWT user_id if available, otherwise require client_email
            if user_id:
                result = tools.get_booking_history(token=token)
            else:
                client_email = params.get("client_email")
                if not client_email:
                    return jsonify({"error": "Missing 'client_email' parameter or valid token"}), 400
                result = tools.get_booking_history(client_email, token)
                
        elif intent == "get_user_profile":
            if user_id:
                result = tools.get_user_profile(user_id, token)
            else:
                user_id_param = params.get("user_id")
                if not user_id_param:
                    return jsonify({"error": "Missing 'user_id' parameter or valid token"}), 400
                result = tools.get_user_profile(user_id_param, token)
                
        elif intent == "update_user_details":
            if not token:
                return jsonify({"error": "Authentication token required"}), 401
            user_details = params.get("user_details")
            if not user_details:
                return jsonify({"error": "Missing 'user_details' parameter"}), 400
            result = tools.update_user_details(token, user_details)
            
        else:
            return jsonify({"error": "Unknown intent"}), 400
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@agent_bp.route('/detect-intent', methods=['POST'])
def detect_user_intent():
    """Detect intent from user message"""
    try:
        data = request.get_json()
        message = data.get("message")
        
        if not message:
            return jsonify({"error": "Missing 'message' field"}), 400
            
        intent = detect_intent(message)
        return jsonify({"intent": intent}), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to detect intent: {str(e)}"}), 500

@agent_bp.route('/chat', methods=['POST'])
@jwt_required(optional=True)
def chat_with_agent():
    """Chat interface that combines intent detection with tool execution"""
    try:
        data = request.get_json()
        message = data.get("message")
        
        if not message:
            return jsonify({"error": "Missing 'message' field"}), 400
        
        # Detect intent from message
        intent = detect_intent(message)
        
        # Get user context if available
        user_context = {}
        try:
            user_id = get_jwt_identity()
            if user_id:
                user_context["user_id"] = user_id
        except:
            pass
        
        # For now, return the detected intent
        # You can extend this to automatically execute tools based on intent
        return jsonify({
            "intent": intent,
            "message": f"I detected your intent as: {intent}. How can I help you further?",
            "user_context": user_context
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Chat error: {str(e)}"}), 500