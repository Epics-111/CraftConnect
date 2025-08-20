from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
import traceback
from datetime import datetime, timedelta
from pymongo.errors import PyMongoError
from flask_cors import CORS

# Import app and db
from app import mongo, app

# Initialize bookings blueprint
bookings_bp = Blueprint('bookings', __name__)
CORS(bookings_bp, resources={r"/api/*": {"origins": "*"}})

# Collection references
bookings_collection = mongo.db.bookings
users_collection = mongo.db.users
services_collection = mongo.db.services

# Create a new booking
@bookings_bp.route('/create', methods=['POST'])
@jwt_required()
def create_booking():
    try:
        data = request.get_json()
        consumer_id = get_jwt_identity()  # The logged-in user is the consumer
        
        # Extract fields from the frontend request format
        service_id = data.get("service")
        client_name = data.get("client_name")
        client_email = data.get("client_email")
        booking_date = data.get("booking_date")
        contact_number = data.get("contact_number")
        special_instructions = data.get("special_instructions")
        
        # Validate required fields
        if not service_id or not booking_date or not client_email:
            return jsonify({"msg": "Missing required fields"}), 400
        
        # Get service details and verify it exists
        service = services_collection.find_one({"_id": ObjectId(service_id)})
        if not service:
            return jsonify({"msg": "Service not found"}), 404
        
        # Extract date and time from the ISO string (frontend sends combined datetime)
        try:
            booking_datetime = datetime.fromisoformat(booking_date.replace('Z', '+00:00'))
            formatted_date = booking_datetime.strftime('%Y-%m-%d')
            formatted_time = booking_datetime.strftime('%H:%M')
        except:
            return jsonify({"msg": "Invalid booking date format"}), 400
        
        # Add consumer and provider details
        booking = {
            "service_id": ObjectId(service_id),
            "service_title": service.get("title", "Unknown Service"),
            "consumer_id": ObjectId(consumer_id),
            "consumer_name": client_name,
            "consumer_email": client_email,
            "contact_number": contact_number,
            "provider_id": ObjectId(service.get("created_by")),
            "booking_date": formatted_date,
            "booking_time": formatted_time,
            "booking_datetime": booking_datetime,
            "status": "Pending",  # Default status is Pending
            "created_at": datetime.now(),
            "special_instructions": special_instructions or "",
            "notes": data.get("notes", "")
        }
        
        # Insert the booking
        result = bookings_collection.insert_one(booking)
        
        # Format the response to match what frontend expects
        response_data = {
            "msg": "Booking created successfully",
            "booking_id": str(result.inserted_id),
            "_id": str(result.inserted_id),
            "service": {
                "_id": str(service_id),
                "title": service.get("title", "Unknown Service")
            },
            "client_name": client_name,
            "client_email": client_email,
            "booking_date": booking_date,
            "contact_number": contact_number,
            "special_instructions": special_instructions,
            "status": "Pending",
            "created_at": datetime.now().isoformat()
        }
        
        return jsonify(response_data), 201
        
    except Exception as e:
        app.logger.error(f"Error creating booking: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"msg": "Failed to create booking", "error": str(e)}), 500

# Get consumer's booking history (bookings made by the user)
@bookings_bp.route('/consumer-history', methods=['GET'])
@jwt_required()
def get_consumer_bookings():
    try:
        consumer_id = get_jwt_identity()
        
        # Check if the request comes with client_email in query params 
        # (supporting the frontend's current implementation)
        client_email = request.args.get('client_email')
        
        # Query condition - use either ID or email
        query = {"consumer_id": ObjectId(consumer_id)}
        if client_email:
            # If client_email is provided, use that instead
            query = {"consumer_email": client_email}
        
        # Query bookings for this consumer
        cursor = bookings_collection.find(query).sort("created_at", -1)  # Sort by newest first
        
        # Process bookings for JSON serialization
        bookings = []
        for booking in cursor:
            # Get service details to match frontend expectations
            service = services_collection.find_one({"_id": booking["service_id"]})
            
            booking_json = {
                '_id': str(booking['_id']),
                'consumer_id': str(booking['consumer_id']),
                'booking_date': booking['booking_date'],
                'status': booking.get('status', 'Pending'),
                # This is the critical part: frontend expects a service object with a title
                'service': {
                    '_id': str(booking['service_id']),
                    'title': booking.get('service_title', service.get('title', 'Unknown Service')),
                    'description': service.get('description', ''),
                    'price': service.get('price', 0)
                }
            }
            bookings.append(booking_json)
        
        # IMPORTANT: Return the array directly, not wrapped in an object
        return jsonify(bookings), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching consumer bookings: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"msg": "Failed to fetch booking history", "error": str(e)}), 500

# Get provider's booking history (bookings for provider's services)
@bookings_bp.route('/provider-history', methods=['GET'])
@jwt_required()
def get_provider_bookings():
    try:
        provider_id = get_jwt_identity()
        
        # Optional: Add pagination
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page
        
        # Query bookings for this provider
        cursor = bookings_collection.find(
            {"provider_id": ObjectId(provider_id)}
        ).sort("created_at", -1)  # Sort by newest first
        
        # Count total before pagination for metadata
        total_bookings = bookings_collection.count_documents({"provider_id": ObjectId(provider_id)})
        
        # Apply pagination
        bookings = list(cursor.skip(skip).limit(per_page))
        
        # Process bookings for JSON serialization
        for booking in bookings:
            booking['_id'] = str(booking['_id'])
            booking['service_id'] = str(booking['service_id'])
            booking['consumer_id'] = str(booking['consumer_id'])
            booking['provider_id'] = str(booking['provider_id'])
            
            # Convert datetime to string
            if isinstance(booking.get('created_at'), datetime):
                booking['created_at'] = booking['created_at'].isoformat()
        
        # Return with pagination metadata
        return jsonify({
            "bookings": bookings,
            "pagination": {
                "total": total_bookings,
                "page": page,
                "per_page": per_page,
                "pages": (total_bookings + per_page - 1) // per_page
            }
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching provider bookings: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"msg": "Failed to fetch booking history", "error": str(e)}), 500

# Get booking details by ID
@bookings_bp.route('/booking/<booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    try:
        user_id = get_jwt_identity()
        
        # Find the booking
        booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            return jsonify({"msg": "Booking not found"}), 404
        
        # Check if user is either the consumer or provider of this booking
        if str(booking["consumer_id"]) != user_id and str(booking["provider_id"]) != user_id:
            return jsonify({"msg": "You don't have permission to view this booking"}), 403
        
        # Convert ObjectIds to strings
        booking['_id'] = str(booking['_id'])
        booking['service_id'] = str(booking['service_id'])
        booking['consumer_id'] = str(booking['consumer_id'])
        booking['provider_id'] = str(booking['provider_id'])
        
        # Convert datetime to string
        if isinstance(booking.get('created_at'), datetime):
            booking['created_at'] = booking['created_at'].isoformat()
        
        return jsonify(booking), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching booking: {str(e)}")
        return jsonify({"msg": "Failed to fetch booking", "error": str(e)}), 500

# Update booking status (e.g., confirm, complete, or cancel)
@bookings_bp.route('/update-status/<booking_id>', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        # Validate input
        if 'status' not in data:
            return jsonify({"msg": "Missing status field"}), 400
            
        new_status = data['status']
        if new_status not in ["pending", "confirmed", "completed", "cancelled"]:
            return jsonify({"msg": "Invalid status value"}), 400
        
        # Find the booking
        booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            return jsonify({"msg": "Booking not found"}), 404
        
        # Check permissions (providers can update any status, consumers can only cancel)
        is_provider = str(booking["provider_id"]) == user_id
        is_consumer = str(booking["consumer_id"]) == user_id
        
        if not (is_provider or is_consumer):
            return jsonify({"msg": "You don't have permission to update this booking"}), 403
        
        if is_consumer and new_status != "cancelled":
            return jsonify({"msg": "Consumers can only cancel bookings"}), 403
        
        # Update the booking status
        result = bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {
                "status": new_status,
                "updated_at": datetime.now()
            }}
        )
        
        if result.modified_count == 0:
            return jsonify({"msg": "No changes were made"}), 200
        
        return jsonify({"msg": "Booking status updated successfully"}), 200
        
    except Exception as e:
        app.logger.error(f"Error updating booking status: {str(e)}")
        return jsonify({"msg": "Failed to update booking", "error": str(e)}), 500

# Add feedback/rating to a completed booking
@bookings_bp.route('/feedback/<booking_id>', methods=['POST'])
@jwt_required()
def add_booking_feedback(booking_id):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        # Validate input
        if 'rating' not in data or not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
            return jsonify({"msg": "Rating must be an integer between 1 and 5"}), 400
        
        # Find the booking
        booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            return jsonify({"msg": "Booking not found"}), 404
        
        # Only consumers can leave feedback
        if str(booking["consumer_id"]) != user_id:
            return jsonify({"msg": "Only the consumer can leave feedback"}), 403
        
        # Ensure booking is completed
        if booking.get('status') != "completed":
            return jsonify({"msg": "Feedback can only be provided for completed bookings"}), 400
        
        # Update the booking with feedback
        feedback = {
            "rating": data['rating'],
            "comment": data.get('comment', ''),
            "created_at": datetime.now()
        }
        
        result = bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"feedback": feedback}}
        )
        
        if result.modified_count == 0:
            return jsonify({"msg": "No changes were made"}), 200
        
        # Optionally: Update the provider's average rating
        update_provider_rating(str(booking["provider_id"]))
        
        return jsonify({"msg": "Feedback added successfully"}), 200
        
    except Exception as e:
        app.logger.error(f"Error adding feedback: {str(e)}")
        return jsonify({"msg": "Failed to add feedback", "error": str(e)}), 500

# Helper function to update provider's average rating
def update_provider_rating(provider_id):
    try:
        # Find all completed bookings with feedback for this provider
        pipeline = [
            {"$match": {
                "provider_id": ObjectId(provider_id),
                "status": "completed",
                "feedback": {"$exists": True}
            }},
            {"$group": {
                "_id": "$provider_id",
                "average_rating": {"$avg": "$feedback.rating"},
                "rating_count": {"$sum": 1}
            }}
        ]
        
        result = list(bookings_collection.aggregate(pipeline))
        
        if result:
            rating_data = result[0]
            # Update the provider's profile with the new rating data
            users_collection.update_one(
                {"_id": ObjectId(provider_id)},
                {"$set": {
                    "providerDetails.average_rating": round(rating_data["average_rating"], 1),
                    "providerDetails.rating_count": rating_data["rating_count"]
                }}
            )
    except Exception as e:
        app.logger.error(f"Error updating provider rating: {str(e)}")

@bookings_bp.route('/auto-complete', methods=['PUT'])
@jwt_required()
def auto_complete_bookings():
    try:
        from dateutil.parser import parse as parse_date
        
        # Calculate cutoff time (2 hours ago)
        cutoff_time = datetime.now() - timedelta(hours=2)
        
        # Get all pending/confirmed bookings
        pending_bookings = list(bookings_collection.find({
            'status': {'$in': ['pending', 'confirmed']}
        }))
        
        updated_count = 0
        
        # Check each booking individually
        for booking in pending_bookings:
            try:
                booking_time = None
                
                # Try different field names
                if 'booking_datetime' in booking:
                    booking_time = booking['booking_datetime']
                elif 'booking_date' in booking:
                    booking_time = booking['booking_date']
                elif 'date' in booking:
                    booking_time = booking['date']
                
                if booking_time:
                    # If it's a string, parse it
                    if isinstance(booking_time, str):
                        booking_time = parse_date(booking_time)
                    
                    # Check if booking is older than cutoff
                    if booking_time < cutoff_time:
                        result = bookings_collection.update_one(
                            {'_id': booking['_id']},
                            {'$set': {'status': 'completed'}}
                        )
                        if result.modified_count > 0:
                            updated_count += 1
                            
            except Exception as booking_error:
                app.logger.error(f"Error processing booking {booking.get('_id')}: {str(booking_error)}")
                continue
        
        app.logger.info(f"Manual auto-complete: Updated {updated_count} bookings")
        
        return jsonify({
            'message': f'Auto-completed {updated_count} bookings',
            'updated': updated_count,
            'total_pending': len(pending_bookings)
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error in auto-complete: {str(e)}")
        return jsonify({
            'message': 'Failed to auto-complete bookings',
            'error': str(e)
        }), 500