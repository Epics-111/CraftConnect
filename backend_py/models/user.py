from bson import ObjectId
from datetime import datetime
import re

user_schema = {
    "name": str,
    "email": str,
    "password": str,  # hashed password expected
    "age": int,
    "contact_no": int,
    "role": str,  # "consumer" or "provider"
    "providerDetails": {
        "serviceType": str,
        "experience": int,
        "hourlyRate": float,
        "location": {
            "type": str,  # 'Point'
            "coordinates": list  # [lng, lat]
        }
    },
    "consumerDetails": {
        "address": str
    },
    "created_at": datetime,
    "updated_at": datetime
}

EMAIL_RE = re.compile(r"[^@]+@[^@]+\.[^@]+")

def _is_valid_geo_point(loc):
    if not isinstance(loc, dict): return False
    if loc.get("type") != "Point": return False
    coords = loc.get("coordinates")
    if not isinstance(coords, (list, tuple)) or len(coords) != 2: return False
    try:
        lng = float(coords[0]); lat = float(coords[1])
    except Exception:
        return False
    return -180.0 <= lng <= 180.0 and -90.0 <= lat <= 90.0

def normalize_provider_location(loc):
    """
    Ensure location is GeoJSON Point and coordinates are floats [lng, lat].
    Raises ValueError on invalid input.
    """
    if not isinstance(loc, dict):
        raise ValueError("location must be an object")
    if loc.get("type") != "Point":
        raise ValueError("location.type must be 'Point'")
    coords = loc.get("coordinates")
    if not isinstance(coords, (list, tuple)) or len(coords) != 2:
        raise ValueError("location.coordinates must be [lng, lat]")
    lng = float(coords[0]); lat = float(coords[1])
    if not (-180.0 <= lng <= 180.0 and -90.0 <= lat <= 90.0):
        raise ValueError("coordinates out of range")
    return {"type": "Point", "coordinates": [lng, lat]}

def validate_user(data, require_email=True):
    errors = []
    if require_email and not data.get("email"):
        errors.append("email is required")
    if data.get("email") and not EMAIL_RE.match(data["email"]):
        errors.append("email is invalid")
    if data.get("role") and data["role"] not in ("consumer", "provider"):
        errors.append("role must be 'consumer' or 'provider'")
    pd = data.get("providerDetails")
    if pd:
        loc = pd.get("location")
        if loc and not _is_valid_geo_point(loc):
            errors.append("providerDetails.location must be GeoJSON Point [lng, lat]")
    return errors

def ensure_user_indexes(db):
    """
    Create useful indexes: unique email and geospatial index for providers.
    Call with mongo.db (PyMongo database) from app startup.
    """
    users = db.users
    try:
        users.create_index("email", unique=True, background=True)
    except Exception:
        pass
    try:
        users.create_index([("providerDetails.location", "2dsphere")], background=True)
    except Exception:
        pass