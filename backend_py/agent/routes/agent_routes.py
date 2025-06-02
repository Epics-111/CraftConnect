from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
from ..models.request_models import IntentRequest, ChatRequest
from ..services import intent_detection, tools
from ..services.intent_detection import detect_intent
import json
import re

# Initialize agent blueprint
agent_bp = Blueprint('agent', __name__)
CORS(agent_bp, resources={r"/api/*": {"origins": "*"}})

def extract_parameters_from_message(message, intent):
    """Extract parameters from user message based on intent"""
    params = {}
    message_lower = message.lower()
    
    if intent == "find_services_by_title" or intent == "search_services_by_title":
        # Extract service type from message
        service_keywords = {
            "plumber": "plumbing",
            "plumbing": "plumbing", 
            "electrician": "electrician",
            "electrical": "electrician",
            "cleaner": "cleaning",
            "cleaning": "cleaning",
            "house cleaning": "cleaning",
            "painter": "painting",
            "painting": "painting",
            "gardener": "gardening",
            "gardening": "gardening",
            "carpenter": "carpentry",
            "carpentry": "carpentry",
            "cooking": "cooking",
            "chef": "cooking",
            "babysitter": "babysitting",
            "babysitting": "babysitting",
            "repair": "repair",
            "tutoring": "tutoring",
            "tutor": "tutoring",
            "photography": "photography",
            "photographer": "photography",
            "laundry": "laundry"
        }
        
        for keyword, service_type in service_keywords.items():
            if keyword in message_lower:
                params["title"] = service_type
                break
    
    elif intent == "find_nearby_services":
        # Default to Nagpur coordinates since that's where your services are
        params["lat"] = 21.1458
        params["lng"] = 79.0882
        params["radius"] = 10
        
        # Look for specific location mentions
        if "near me" in message_lower or "nearby" in message_lower:
            params["radius"] = 5
        elif "far" in message_lower or "wide area" in message_lower:
            params["radius"] = 20
    
    elif intent == "create_booking":
        # For booking, we need user data from JWT token
        # Parameters will be handled in the main function
        pass
    
    return params

def format_service_response(services, intent):
    """Format service data into user-friendly response"""
    if not services or (isinstance(services, dict) and services.get("error")):
        return "Sorry, I couldn't find any services matching your request. Please try a different search or check our available service categories."
    
    if isinstance(services, dict) and "error" in services:
        return f"I encountered an issue: {services['error']}. Please try again or contact support."
    
    if not isinstance(services, list):
        services = [services] if services else []
    
    if len(services) == 0:
        return "I couldn't find any services matching your criteria. You might want to try:\n• Expanding your search radius\n• Checking different service categories\n• Browsing all available services"
    
    if len(services) == 1:
        service = services[0]
        price = service.get('price', {})
        if isinstance(price, dict):
            price_value = price.get('$numberDecimal', 'Contact for pricing')
        else:
            price_value = price or 'Contact for pricing'
            
        response = f"I found a great service for you!\n\n"
        response += f"🔧 **{service.get('title', 'Service')}**\n"
        response += f"📍 {service.get('location', 'Available in your area')}\n"
        response += f"💰 Starting from ₹{price_value}\n"
        response += f"📧 Contact: {service.get('provider_email', 'N/A')}\n\n"
        response += f"📝 {service.get('description', 'Professional service available')}\n\n"
        response += f"Would you like to book this service or see more options?"
        
    else:
        response = f"Great! I found {len(services)} services for you:\n\n"
        for i, service in enumerate(services[:3], 1):  # Show top 3
            price = service.get('price', {})
            if isinstance(price, dict):
                price_value = price.get('$numberDecimal', 'Contact for pricing')
            else:
                price_value = price or 'Contact for pricing'
                
            response += f"{i}. 🔧 **{service.get('title', 'Service')}**\n"
            response += f"   💰 ₹{price_value} | 📧 {service.get('provider_email', 'N/A')}\n\n"
        
        if len(services) > 3:
            response += f"...and {len(services) - 3} more services available.\n\n"
        
        response += "Would you like details about any specific service or help with booking?"
    
    return response

def format_booking_response(booking_result):
    """Format booking response for user"""
    if isinstance(booking_result, dict) and booking_result.get("error"):
        return f"I couldn't complete your booking: {booking_result['error']}. Please make sure you're logged in and try again."
    
    if booking_result.get("message") == "Booking created successfully":
        return "🎉 Great! Your booking has been created successfully!\n\nYou'll receive a confirmation email shortly. The service provider will contact you to confirm the appointment details.\n\nYou can check your booking status in the 'My Bookings' section."
    
    return "Your booking request has been submitted. Please check your booking history for updates."

def get_user_context():
    """Get user context from JWT token"""
    user_context = {}
    try:
        user_id = get_jwt_identity()
        if user_id:
            user_context["user_id"] = user_id
            
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            user_context["token"] = auth_header.replace('Bearer ', '')
    except:
        pass
    
    return user_context

@agent_bp.route('/handle-intent', methods=['POST'])
@jwt_required(optional=True)
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
    """Enhanced chat interface that detects intent, executes tools, and returns formatted responses"""
    try:
        data = request.get_json()
        message = data.get("message")
        
        if not message:
            return jsonify({"error": "Missing 'message' field"}), 400
        
        # Detect intent from message
        intent = detect_intent(message)
        print("Detected intent:", intent)
        
        # Get user context
        user_context = get_user_context()
        print("User context:", user_context)
        
        # Extract parameters from the message based on intent
        params = extract_parameters_from_message(message, intent)
        print("Extracted parameters:", params)
        
        # Auto-inject user context into parameters
        if user_context.get("user_id"):
            params["user_id"] = user_context["user_id"]
        if user_context.get("token"):
            params["token"] = user_context["token"]
        
        # Execute the appropriate tool based on intent
        try:
            if intent == "find_services_by_title" or intent == "search_services_by_title":
                if not params.get("title"):
                    reply = "I'd be happy to help you find services! Could you please specify what type of service you're looking for? For example: plumbing, electrical work, cleaning, painting, etc."
                else:
                    result = tools.find_services_by_title(params["title"])
                    reply = format_service_response(result, intent)
            
            elif intent == "find_nearby_services":
                result = tools.find_nearby_services(
                    params.get("lat", 21.1458), 
                    params.get("lng", 79.0882), 
                    params.get("radius", 10)
                )
                reply = format_service_response(result, intent)
            
            elif intent == "get_service_details":
                if not params.get("service_id"):
                    reply = "I'd be happy to show you service details! Could you please specify which service you're interested in, or browse our services first?"
                else:
                    result = tools.get_service_details(params["service_id"])
                    reply = format_service_response(result, intent)
            
            elif intent == "create_booking":
                if not user_context.get("token"):
                    reply = "To make a booking, you'll need to be logged in first. Please log in to your account and then I can help you book a service!"
                else:
                    reply = "I'd love to help you book a service! To complete your booking, I'll need:\n• The service you want to book\n• Your preferred date and time\n• Your contact information\n\nYou can also use our booking form on the service details page for a smoother experience."
            
            elif intent == "get_booking_history":
                if not user_context.get("token"):
                    reply = "To view your booking history, please log in to your account first. Once logged in, I can show you all your past and current bookings."
                else:
                    result = tools.get_booking_history(token=user_context["token"])
                    if isinstance(result, list) and len(result) > 0:
                        reply = f"You have {len(result)} booking(s) in your history:\n\n"
                        for i, booking in enumerate(result[:3], 1):
                            reply += f"{i}. {booking.get('service', {}).get('title', 'Service')} - {booking.get('status', 'Unknown status')}\n"
                        if len(result) > 3:
                            reply += f"\n...and {len(result) - 3} more. Visit your booking history page to see all bookings."
                    else:
                        reply = "You don't have any bookings yet. Would you like to browse our services and make your first booking?"
            
            elif intent == "get_user_profile":
                if not user_context.get("token"):
                    reply = "To view your profile, please log in to your account first."
                else:
                    reply = "You can view and update your profile information in the user settings. Is there something specific about your profile you'd like to know or update?"
            
            elif intent == "list_services":
                result = tools.find_nearby_services(21.1458, 79.0882, 50)  # Large radius to get all services
                reply = format_service_response(result, intent)
            
            else:
                # Handle general conversation
                reply = f"I understand you're asking about {intent}. I'm here to help you with CraftConnect services! You can ask me to:\n\n• Find specific services (plumbing, electrical, etc.)\n• Show nearby services\n• Help with booking questions\n• Check your booking history\n\nHow can I assist you today?"
                
        except Exception as tool_error:
            reply = f"I encountered an issue while processing your request: {str(tool_error)}. Please try again or contact our support team if the problem persists."
        
        return jsonify({
            "reply": reply,
            "intent": intent,
            "user_context": user_context,
            "parameters": params
        }), 200
        
    except Exception as e:
        return jsonify({
            "reply": "I'm sorry, I'm having trouble right now. Please try again in a moment or contact our support team if the issue continues.",
            "error": f"Chat error: {str(e)}"
        }), 500