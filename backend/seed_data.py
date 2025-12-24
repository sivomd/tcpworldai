"""
Seed script to populate the TCPWorld database with sample data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🌱 Seeding TCPWorld database...")
    
    # Sample Events
    events = [
        {
            "id": str(uuid.uuid4()),
            "title": "CyberSecurity Summit 2025",
            "description": "Join the world's leading cybersecurity experts for three days of intensive learning, networking, and innovation. Explore the latest trends in threat intelligence, zero-trust architecture, and AI-powered security solutions.",
            "event_type": "conference",
            "start_date": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=32)).isoformat(),
            "venue": "San Francisco Convention Center",
            "city": "San Francisco",
            "country": "USA",
            "capacity": 500,
            "available_seats": 500,
            "ticket_price": 999.0,
            "image_url": "https://images.pexels.com/photos/35335992/pexels-photo-35335992.jpeg",
            "agenda": "Day 1: Keynote & Threat Intelligence\nDay 2: Zero-Trust & Cloud Security\nDay 3: AI/ML in Cybersecurity",
            "is_featured": True,
            "status": "upcoming",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "AI Innovation Conference",
            "description": "Discover the future of artificial intelligence with thought leaders from top tech companies. Learn about GPT-5, autonomous systems, and ethical AI development.",
            "event_type": "conference",
            "start_date": (datetime.now(timezone.utc) + timedelta(days=60)).isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=61)).isoformat(),
            "venue": "Tech Hub Center",
            "city": "Boston",
            "country": "USA",
            "capacity": 300,
            "available_seats": 300,
            "ticket_price": 1299.0,
            "image_url": "https://images.pexels.com/photos/35335989/pexels-photo-35335989.jpeg",
            "agenda": "AI Ethics, Large Language Models, Computer Vision, Autonomous Systems",
            "is_featured": True,
            "status": "upcoming",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Cloud Security Workshop",
            "description": "Hands-on workshop focusing on securing cloud infrastructure across AWS, Azure, and GCP. Learn best practices for IAM, encryption, and compliance.",
            "event_type": "workshop",
            "start_date": (datetime.now(timezone.utc) + timedelta(days=45)).isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=45)).isoformat(),
            "venue": "CloudTech Training Center",
            "city": "Seattle",
            "country": "USA",
            "capacity": 100,
            "available_seats": 100,
            "ticket_price": 499.0,
            "image_url": "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e",
            "agenda": "Cloud Security Fundamentals, IAM Best Practices, Encryption Strategies",
            "is_featured": False,
            "status": "upcoming",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.events.insert_many(events)
    print(f"✅ Added {len(events)} events")
    
    # Sample Awards
    awards = [
        {
            "id": str(uuid.uuid4()),
            "title": "Cybersecurity Leader of the Year",
            "category": "cybersecurity",
            "description": "Recognizing exceptional leadership in advancing cybersecurity practices and protecting organizations from evolving threats.",
            "year": 2025,
            "nomination_start": datetime.now(timezone.utc).isoformat(),
            "nomination_end": (datetime.now(timezone.utc) + timedelta(days=90)).isoformat(),
            "winner_id": None,
            "winner_name": None,
            "status": "open",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "AI Innovation Excellence",
            "category": "ai",
            "description": "Celebrating groundbreaking innovations in artificial intelligence that push the boundaries of what's possible.",
            "year": 2025,
            "nomination_start": datetime.now(timezone.utc).isoformat(),
            "nomination_end": (datetime.now(timezone.utc) + timedelta(days=90)).isoformat(),
            "winner_id": None,
            "winner_name": None,
            "status": "open",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Technology Leadership Award",
            "category": "leadership",
            "description": "Honoring visionary leaders who have transformed their organizations through technology innovation.",
            "year": 2025,
            "nomination_start": datetime.now(timezone.utc).isoformat(),
            "nomination_end": (datetime.now(timezone.utc) + timedelta(days=90)).isoformat(),
            "winner_id": None,
            "winner_name": None,
            "status": "open",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.awards.insert_many(awards)
    print(f"✅ Added {len(awards)} awards")
    
    # Sample Speakers
    speakers = [
        {
            "id": str(uuid.uuid4()),
            "name": "Dr. Sarah Chen",
            "title": "Chief Security Officer",
            "organization": "TechCorp Global",
            "bio": "Dr. Chen is a renowned cybersecurity expert with over 20 years of experience in protecting enterprise infrastructure. She has led security initiatives for Fortune 500 companies and is a frequent keynote speaker at international conferences.",
            "expertise": ["Cybersecurity", "Threat Intelligence", "Zero Trust", "Cloud Security"],
            "image_url": "https://images.unsplash.com/photo-1594938384824-022767a58e11",
            "linkedin_url": "https://linkedin.com",
            "twitter_url": "https://twitter.com",
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Michael Rodriguez",
            "title": "Head of AI Research",
            "organization": "Innovation Labs",
            "bio": "Michael leads cutting-edge AI research focusing on large language models and ethical AI development. His work has been published in top-tier conferences including NeurIPS and ICML.",
            "expertise": ["Artificial Intelligence", "Machine Learning", "NLP", "Ethics in AI"],
            "image_url": "https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg",
            "linkedin_url": "https://linkedin.com",
            "twitter_url": "https://twitter.com",
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Jennifer Lee",
            "title": "VP of Cloud Architecture",
            "organization": "CloudScale Inc",
            "bio": "Jennifer is a cloud architecture specialist with expertise in designing scalable, secure cloud solutions. She has helped numerous organizations migrate to the cloud while maintaining robust security postures.",
            "expertise": ["Cloud Computing", "AWS", "Azure", "DevSecOps"],
            "image_url": "https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg",
            "linkedin_url": "https://linkedin.com",
            "twitter_url": None,
            "is_featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.speakers.insert_many(speakers)
    print(f"✅ Added {len(speakers)} speakers")
    
    print("\n🎉 Database seeding completed successfully!")
    print("\n📊 Summary:")
    print(f"   - Events: {len(events)}")
    print(f"   - Awards: {len(awards)}")
    print(f"   - Speakers: {len(speakers)}")
    print("\n💡 You can now explore the platform with sample data!")
    print("\n🔐 Admin Login:")
    print("   Email: admin@tcpworld.ai")
    print("   Password: admin123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
