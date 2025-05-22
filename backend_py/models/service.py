# Service model schema for PyMongo
service_schema = {
    "title": str,
    "description": str,
    "price": float,  # Using float for price in Python
    "provider_name": str,
    "provider_contact": int,
    "provider_email": str,
    "location": {
        "type": str,  # This will be 'Point'
        "coordinates": list  # [longitude, latitude]
    }
}

# Example validation function
def validate_service(service_data):
    """Validates service data against the schema"""
    errors = []
    
    required_fields = ["title", "description", "price", "provider_name", "provider_contact", "provider_email"]
    for field in required_fields:
        if field not in service_data:
            errors.append(f"Missing required field: {field}")
            
    if "location" not in service_data:
        errors.append("Missing location data")
    elif "type" not in service_data["location"] or service_data["location"]["type"] != "Point":
        errors.append("Location must be of type 'Point'")
    elif "coordinates" not in service_data["location"] or len(service_data["location"]["coordinates"]) != 2:
        errors.append("Location must have coordinates [longitude, latitude]")
        
    return errors