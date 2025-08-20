

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
            bookings_collection = mongo.db.bookings
            
            # Calculate cutoff time (2 hours ago)
            cutoff_time = datetime.now() - timedelta(hours=2)
            
            # Find and update bookings that should be completed
            result = bookings_collection.update_many(
                {
                    'booking_datetime': {'$lt': cutoff_time},
                    'status': {'$in': ['pending', 'confirmed']}
                },
                {
                    '$set': {'status': 'completed'}
                }
            )
            
            app.logger.info(f"Cron job: Auto-completed {result.modified_count} bookings at {datetime.now()}")
            return result.modified_count
            
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