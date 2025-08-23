from datetime import datetime
from bson import ObjectId

booking_schema = {
    "service_id": str,      # ObjectId string
    "consumer_id": str,     # ObjectId string
    "provider_id": str,     # ObjectId string
    "scheduled_at": datetime,
    "status": str,          # pending, confirmed, cancelled, completed
    "price": float,
    "created_at": datetime,
    "updated_at": datetime
}

ALLOWED_STATUSES = {"pending", "confirmed", "cancelled", "completed"}

def validate_booking(data):
    errors = []
    if not data.get("service_id"):
        errors.append("service_id is required")
    if not data.get("consumer_id"):
        errors.append("consumer_id is required")
    if not data.get("provider_id"):
        errors.append("provider_id is required")
    if "scheduled_at" in data:
        try:
            # allow datetime or ISO string
            if not isinstance(data["scheduled_at"], datetime):
                # try to parse ISO
                from dateutil import parser
                data["scheduled_at"] = parser.isoparse(data["scheduled_at"])
        except Exception:
            errors.append("scheduled_at must be a valid datetime or ISO string")
    if data.get("status") and data["status"] not in ALLOWED_STATUSES:
        errors.append(f"status must be one of {ALLOWED_STATUSES}")
    return errors

def ensure_booking_indexes(db):
    bookings = db.bookings
    try:
        bookings.create_index("service_id", background=True)
        bookings.create_index("consumer_id", background=True)
        bookings.create_index("provider_id", background=True)
        bookings.create_index("scheduled_at", background=True)
    except Exception:
        pass