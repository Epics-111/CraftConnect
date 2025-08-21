import threading
import time
from datetime import datetime, timedelta
import requests
import os
from app import app, mongo

def auto_complete_bookings_task():
    """Background task to auto-complete bookings"""
    try:
        with app.app_context():
            from dateutil.parser import parse as parse_date
            bookings_collection = mongo.db.bookings
            
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
            
            app.logger.info(f"Cron job: Auto-completed {updated_count} bookings at {datetime.now()}")
            return updated_count
            
    except Exception as e:
        app.logger.error(f"Cron job error: {str(e)}")
        return 0

def schedule_booking_completion():
    """Scheduler function that runs the auto-completion task every hour"""
    while True:
        try:
            # Run the auto-completion task
            completed_count = auto_complete_bookings_task()
            
            # Log the result
            print(f"[{datetime.now()}] Auto-completion cron job completed. Updated {completed_count} bookings.")
            
            # Wait for 1 hour (3600 seconds) before running again
            time.sleep(3600)
            
        except Exception as e:
            print(f"[{datetime.now()}] Cron job error: {str(e)}")
            # Wait 10 minutes before retrying if there's an error
            time.sleep(600)

def start_scheduler():
    """Start the background scheduler thread"""
    scheduler_thread = threading.Thread(target=schedule_booking_completion, daemon=True)
    scheduler_thread.start()
    print("Background booking auto-completion scheduler started")