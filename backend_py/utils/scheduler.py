import threading
import time
from datetime import datetime, timedelta
import requests
import os
from extensions import mongo
from flask import current_app

# Alternative more efficient version
def auto_complete_bookings_task(app):
    """Background task to auto-complete bookings using passed-in Flask app."""
    try:
        with app.app_context():
            bookings_collection = mongo.db.bookings
            cutoff_time = datetime.now()
            
            result = bookings_collection.update_many(
                {
                    '$and': [
                        {'status': {'$nin': ['completed', 'cancelled']}},
                        {
                            '$or': [
                                {'booking_datetime': {'$lt': cutoff_time}},
                                {'booking_date': {'$lt': cutoff_time}},
                                {'date': {'$lt': cutoff_time}},
                                {'datetime': {'$lt': cutoff_time}}
                            ]
                        }
                    ]
                },
                {'$set': {'status': 'completed'}}
            )
            
            updated_count = result.modified_count
            app.logger.info(f"Cron job: Auto-completed {updated_count} bookings at {datetime.now()}")
            return updated_count
            
    except Exception as e:
        # Use current_app logger if app is not available
        try:
            current_app.logger.error(f"Cron job error: {str(e)}")
        except Exception:
            print(f"Cron job error: {e}")
        return 0

def schedule_booking_completion(app):
    """Scheduler function that runs the auto-completion task every hour"""
    while True:
        try:
            # Run the auto-completion task
            completed_count = auto_complete_bookings_task(app)
            
            # Log the result
            try:
                app.logger.info(f"[{datetime.now()}] Auto-completion cron job completed. Updated {completed_count} bookings.")
            except Exception:
                print(f"[{datetime.now()}] Auto-completion cron job completed. Updated {completed_count} bookings.")
            
            # Wait for 1 hour (3600 seconds) before running again
            time.sleep(3600)
            
        except Exception as e:
            print(f"[{datetime.now()}] Cron job error: {str(e)}")
            # Wait 10 minutes before retrying if there's an error
            time.sleep(600)

def start_scheduler(app):
    """Start the background scheduler thread; pass the Flask app instance."""
    scheduler_thread = threading.Thread(target=schedule_booking_completion, args=(app,), daemon=True)
    scheduler_thread.start()
    try:
        app.logger.info("Background booking auto-completion scheduler started")
    except Exception:
        print("Background booking auto-completion scheduler started")