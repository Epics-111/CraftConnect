from ..config.agent_config import watsonx_llm

# Define possible intents
intents = [
    "register_user",
    "login_user",
    "get_user_profile",
    "update_user_profile",
    "create_service",
    "update_service",
    "list_services",
    "get_service_details",
    "search_services_by_title",
    "find_nearby_services",
    "create_booking",
    "get_service_bookings",
    "get_booking_history",
    "cancel_booking",
    "other"
]

def detect_intent(user_message: str) -> str:
    """Detect user intent from message using WatsonX LLM"""
    system_prompt = (
        "You are an intent classifier for a conversational agent. "
        f"Possible intents: {', '.join(intents)}. "
        "Given a user message, respond ONLY with the intent label that best matches the message."
    )
    
    try:
        # Use the LLM to classify intent
        response = watsonx_llm.invoke([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ])
        
        detected_intent = response.content.strip().lower()
        
        # Validate the detected intent
        if detected_intent in intents:
            return detected_intent
        else:
            return "other"
            
    except Exception as e:
        print(f"Error detecting intent: {e}")
        return "other"