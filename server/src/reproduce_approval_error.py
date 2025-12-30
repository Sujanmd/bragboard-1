import sys
import os

# Add the current directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.core import SessionLocal
from auth.models import User
from admin.routes import get_pending_users

def test_get_pending_users():
    print("Connecting to database...")
    db = SessionLocal()
    try:
        print("Calling get_pending_users...")
        # passing current_user=None because the function doesn't use it, 
        # normally injected by Depends
        response = get_pending_users(current_user=None, db=db)
        print("Response:", response)
    except Exception as e:
        print("Error occurred:")
        print(e)
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_get_pending_users()
