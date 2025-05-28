from config import watsonx_llm

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

system_prompt = (
    "You are an intent classifier for a conversational agent. "
    f"Possible intents: {', '.join(intents)}. "
    "Given a user message, respond ONLY with the intent label that best matches the message."
)

# Example user messages to test
test_messages = [
    # "I want to sign up for a new account.",
    # "Show me services near my location.",
    # "How do I cancel my booking?",
    # "Can I update my profile details?",
    "Tell me about the plumbing service.",
    "Hi, I need some help."
]

#testing the intent classifier
print("Testing the intent classifier...\n")

for msg in test_messages:
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": msg}
    ]
    response = watsonx_llm.invoke(messages)
    print(f"User: {msg}\nPredicted intent: {response.content}\n")