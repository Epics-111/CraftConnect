from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
import traceback
from pymongo.errors import PyMongoError
from flask_cors import CORS

# Import app and db
from app import mongo, app

# Initialize services blueprint
services_bp = Blueprint('services', __name__)
CORS(services_bp, resources={r"/api/*": {"origins": "*"}})

# Collection reference
services_collection = mongo.db.services

# Get all services
@services_bp.route('/all', methods=['GET'])
def get_all_services():
    try:
        services = list(services_collection.find())
        # Convert ObjectId to string for JSON serialization
        for service in services:
            service['_id'] = str(service['_id'])
        return jsonify(services), 200
    except Exception as e:
        app.logger.error(f"Error fetching all services: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"msg": "Failed to fetch services", "error": str(e)}), 500

# Get service by ID
@services_bp.route('/service/<service_id>', methods=['GET'])
def get_service_by_id(service_id):
    try:
        service = services_collection.find_one({"_id": ObjectId(service_id)})
        if not service:
            return jsonify({"msg": "Service not found"}), 404
        
        # Convert ObjectId to string
        service['_id'] = str(service['_id'])
        return jsonify(service), 200
    except Exception as e:
        app.logger.error(f"Error fetching service by ID: {str(e)}")
        return jsonify({"msg": "Failed to fetch service", "error": str(e)}), 500

# Search services by title
@services_bp.route('/title/<title>', methods=['GET'])
def search_service_by_title(title):
    try:
        services = list(services_collection.find({
            "title": {"$regex": title, "$options": "i"}  # Case-insensitive search
        }))
        
        # Convert ObjectId to string
        for service in services:
            service['_id'] = str(service['_id'])
            
        return jsonify(services), 200
    except Exception as e:
        app.logger.error(f"Error searching services by title: {str(e)}")
        return jsonify({"msg": "Failed to search services", "error": str(e)}), 500

# Get nearby services
@services_bp.route('/nearby', methods=['GET'])
def get_nearby_services():
    try:
        # Get query parameters
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        radius = float(request.args.get('radius', 5))  # Default 5km
        
        if not lat or not lng:
            return jsonify({"msg": "Latitude and longitude are required"}), 400
            
        # Convert to float
        lat = float(lat)
        lng = float(lng)
        
        # Convert radius from km to meters
        radius_meters = radius * 1000
        
        # Perform geospatial query
        services = list(services_collection.find({
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "$maxDistance": radius_meters
                }
            }
        }))
        
        # Convert ObjectId to string
        for service in services:
            service['_id'] = str(service['_id'])
            
        return jsonify(services), 200
    except PyMongoError as e:
        app.logger.error(f"Database error in nearby services: {str(e)}")
        return jsonify({"msg": "Database error", "error": str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error fetching nearby services: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"msg": "Failed to fetch nearby services", "error": str(e)}), 500

# Create a new service (Protected endpoint)
@services_bp.route('/create', methods=['POST'])
@jwt_required()
def create_service():
    try:
        data = request.get_json()
        
        # Optional: Validate service data here
        # errors = validate_service(data)
        # if errors:
        #     return jsonify({"msg": "Invalid service data", "errors": errors}), 400
        
        # Add creation timestamp and user ID
        data['created_by'] = get_jwt_identity()
        
        # Insert the new service
        result = services_collection.insert_one(data)
        
        # Return the ID of the newly created service
        return jsonify({
            "msg": "Service created successfully", 
            "service_id": str(result.inserted_id)
        }), 201
    except Exception as e:
        app.logger.error(f"Error creating service: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"msg": "Failed to create service", "error": str(e)}), 500

# Update a service (Protected endpoint)
@services_bp.route('/update/<service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        # Verify the service belongs to the user
        service = services_collection.find_one({
            "_id": ObjectId(service_id),
            "created_by": user_id
        })
        
        if not service:
            return jsonify({"msg": "Service not found or you don't have permission to update it"}), 403
        
        # Update the service
        result = services_collection.update_one(
            {"_id": ObjectId(service_id)},
            {"$set": data}
        )
        
        if result.modified_count == 0:
            return jsonify({"msg": "No changes made to the service"}), 200
            
        return jsonify({"msg": "Service updated successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error updating service: {str(e)}")
        return jsonify({"msg": "Failed to update service", "error": str(e)}), 500

# Delete a service (Protected endpoint)
@services_bp.route('/delete/<service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    try:
        user_id = get_jwt_identity()
        
        # Verify the service belongs to the user
        service = services_collection.find_one({
            "_id": ObjectId(service_id),
            "created_by": user_id
        })
        
        if not service:
            return jsonify({"msg": "Service not found or you don't have permission to delete it"}), 403
        
        # Delete the service
        result = services_collection.delete_one({"_id": ObjectId(service_id)})
        
        if result.deleted_count == 0:
            return jsonify({"msg": "Service could not be deleted"}), 500
            
        return jsonify({"msg": "Service deleted successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error deleting service: {str(e)}")
        return jsonify({"msg": "Failed to delete service", "error": str(e)}), 500