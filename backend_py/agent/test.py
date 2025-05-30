# lets check tools here 
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_BASE_URL = os.getenv("API_BASE_URL")

resp = requests.get(f"{API_BASE_URL}/bookings/consumer-history")
if resp.status_code != 200:
    print(f"Error: {resp.status_code} - {resp.text}")
else:
    print("Booking History:")
    print(resp.json())