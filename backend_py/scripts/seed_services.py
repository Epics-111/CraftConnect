from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_default_database()
services_collection = db.services

# Define sample services (similar to your Node.js script)
services = [
    {
        "title": "Emergency Plumbing",
        "description": "Professional plumbing services for emergencies. Available 24/7.",
        "price": 850.00,
        "provider_name": "Nagpur Quick Fix Plumbing",
        "provider_contact": 9175551234,
        "provider_email": "service@nagpurplumbing.com",
        "location": {
            "type": "Point",
            "coordinates": [79.0882, 21.1458]  # Central Nagpur
        }
    },
    {
        "title": "House Cleaning",
        "description": "Professional cleaning services for homes and apartments.",
        "price": 650.00,
        "provider_name": "CleanHome Nagpur",
        "provider_contact": 9175552345,
        "provider_email": "info@cleanhomenagpur.com",
        "location": {
            "type": "Point",
            "coordinates": [79.0952, 21.1392]  # Slightly southeast of center
        }
    }
    # Add more services as needed
]

# Create geospatial index
services_collection.create_index([("location", "2dsphere")])

# Insert services
services_collection.insert_many(services)
print(f"Added {len(services)} sample services to the database")