from typing import Any, Dict
import requests
import os
from flask_jwt_extended import get_jwt_identity

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000/api")

def find_services_by_title(title: str) -> Dict[str, Any]:
    """Search for services by title."""
    try:
        resp = requests.get(f"{API_BASE_URL}/services/service/title/{title}")
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        return {"error": f"Failed to search services: {str(e)}"}

def get_service_details(service_id: str) -> Dict[str, Any]:
    """Get details of a specific service by ID."""
    try:
        resp = requests.get(f"{API_BASE_URL}/services/service/{service_id}")
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        return {"error": f"Failed to get service details: {str(e)}"}

def find_nearby_services(lat: float, lng: float, radius: float = 5) -> Dict[str, Any]:
    """Find services near a given location."""
    try:
        params = {"lat": lat, "lng": lng, "radius": radius}
        resp = requests.get(f"{API_BASE_URL}/services/nearby", params=params)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        return {"error": f"Failed to find nearby services: {str(e)}"}

def create_booking(service_id: str, client_name: str, client_email: str, 
                  booking_date: str, contact_number: str, 
                  special_instructions: str = "", token: str = None) -> Dict[str, Any]:
    """Book a service."""
    try:
        payload = {
            "service": service_id,
            "client_name": client_name,
            "client_email": client_email,
            "booking_date": booking_date,
            "contact_number": contact_number,
            "special_instructions": special_instructions
        }
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        resp = requests.post(f"{API_BASE_URL}/bookings/create", json=payload, headers=headers)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        return {"error": f"Failed to create booking: {str(e)}"}

def get_booking_history(client_email: str = None, token: str = None) -> Dict[str, Any]:
    """Get booking history for a user."""
    try:
        params = {"client_email": client_email} if client_email else {}
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        resp = requests.get(f"{API_BASE_URL}/bookings/consumer-history", 
                          params=params, headers=headers)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        return {"error": f"Failed to get booking history: {str(e)}"}

def get_user_profile(user_id: str, token: str = None) -> Dict[str, Any]:
    """Get user profile details."""
    try:
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        resp = requests.get(f"{API_BASE_URL}/users/profile/{user_id}", headers=headers)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        return {"error": f"Failed to get user profile: {str(e)}"}

def update_user_details(token: str, user_details: dict) -> Dict[str, Any]:
    """Update user details (requires JWT token)."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.post(f"{API_BASE_URL}/users/save-details", 
                           json=user_details, headers=headers)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        return {"error": f"Failed to update user details: {str(e)}"}