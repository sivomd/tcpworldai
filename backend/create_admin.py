"""
Script to create an admin user for TCPWorld
Run this once to create the initial admin account
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    admin_email = "admin@tcpworld.ai"
    admin_password = "admin123"  # Change this password after first login!
    
    # Check if admin exists
    existing_admin = await db.users.find_one({"email": admin_email})
    if existing_admin:
        print(f"Admin user already exists: {admin_email}")
        client.close()
        return
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": admin_email,
        "full_name": "TCPWorld Admin",
        "role": "admin",
        "organization": "TCPWorld",
        "hashed_password": pwd_context.hash(admin_password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(admin_user)
    
    print("=" * 50)
    print("Admin user created successfully!")
    print("=" * 50)
    print(f"Email: {admin_email}")
    print(f"Password: {admin_password}")
    print("\n⚠️  IMPORTANT: Change this password after first login!")
    print("=" * 50)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
