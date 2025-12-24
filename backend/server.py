from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from icalendar import Calendar, Event as ICalEvent
from io import BytesIO

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "tcpworld-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI(title="TCPWorld API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================

class UserRole:
    ADMIN = "admin"
    ATTENDEE = "attendee"
    SPEAKER = "speaker"
    PUBLIC = "public"


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    role: str = UserRole.PUBLIC
    organization: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization: Optional[str] = None
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_type: str  # conference, webinar, workshop
    start_date: datetime
    end_date: datetime
    venue: str
    city: str
    country: str
    capacity: int
    available_seats: int
    ticket_price: float
    image_url: Optional[str] = None
    agenda: Optional[str] = None
    is_featured: bool = False
    status: str = "upcoming"  # upcoming, ongoing, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EventCreate(BaseModel):
    title: str
    description: str
    event_type: str
    start_date: datetime
    end_date: datetime
    venue: str
    city: str
    country: str
    capacity: int
    ticket_price: float
    image_url: Optional[str] = None
    agenda: Optional[str] = None
    is_featured: bool = False


class Award(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str  # cybersecurity, ai, innovation, leadership
    description: str
    year: int
    nomination_start: datetime
    nomination_end: datetime
    winner_id: Optional[str] = None
    winner_name: Optional[str] = None
    status: str = "open"  # open, closed, announced
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AwardCreate(BaseModel):
    title: str
    category: str
    description: str
    year: int
    nomination_start: datetime
    nomination_end: datetime


class Nomination(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    award_id: str
    nominee_name: str
    nominee_email: EmailStr
    nominee_organization: str
    nomination_statement: str
    nominated_by_user_id: str
    status: str = "pending"  # pending, approved, rejected, winner
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class NominationCreate(BaseModel):
    award_id: str
    nominee_name: str
    nominee_email: EmailStr
    nominee_organization: str
    nomination_statement: str


class Registration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_id: str
    user_id: str
    user_name: str
    user_email: EmailStr
    ticket_type: str = "standard"
    payment_status: str = "pending"  # pending, completed, failed
    payment_amount: float
    registration_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RegistrationCreate(BaseModel):
    event_id: str
    ticket_type: str = "standard"


class Speaker(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    organization: str
    bio: str
    expertise: List[str]
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SpeakerCreate(BaseModel):
    name: str
    title: str
    organization: str
    bio: str
    expertise: List[str]
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    is_featured: bool = False


class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_id: str
    title: str
    description: str
    speaker_ids: List[str]
    start_time: datetime
    end_time: datetime
    room: str
    session_type: str  # keynote, panel, workshop, networking
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SessionCreate(BaseModel):
    event_id: str
    title: str
    description: str
    speaker_ids: List[str]
    start_time: datetime
    end_time: datetime
    room: str
    session_type: str


class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    status: str = "new"  # new, in_progress, resolved
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


# ==================== HELPER FUNCTIONS ====================

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user_doc is None:
        raise credentials_exception
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)


async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        organization=user_data.organization,
        phone=user_data.phone,
        role=UserRole.ATTENDEE
    )
    
    user_doc = user.model_dump()
    user_doc['hashed_password'] = hashed_password
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    await db.users.insert_one(user_doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)


@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user_doc.get('hashed_password', '')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)


@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ==================== EVENTS ENDPOINTS ====================

@api_router.get("/events", response_model=List[Event])
async def get_events(status: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if status:
        query['status'] = status
    if featured is not None:
        query['is_featured'] = featured
    
    events = await db.events.find(query, {"_id": 0}).sort("start_date", -1).to_list(1000)
    
    for event in events:
        for date_field in ['start_date', 'end_date', 'created_at']:
            if isinstance(event.get(date_field), str):
                event[date_field] = datetime.fromisoformat(event[date_field])
    
    return events


@api_router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    event_doc = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event_doc:
        raise HTTPException(status_code=404, detail="Event not found")
    
    for date_field in ['start_date', 'end_date', 'created_at']:
        if isinstance(event_doc.get(date_field), str):
            event_doc[date_field] = datetime.fromisoformat(event_doc[date_field])
    
    return Event(**event_doc)


@api_router.post("/events", response_model=Event)
async def create_event(event_data: EventCreate, admin: User = Depends(get_admin_user)):
    event = Event(
        **event_data.model_dump(),
        available_seats=event_data.capacity
    )
    
    event_doc = event.model_dump()
    for date_field in ['start_date', 'end_date', 'created_at']:
        event_doc[date_field] = event_doc[date_field].isoformat()
    
    await db.events.insert_one(event_doc)
    return event


@api_router.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, event_data: EventCreate, admin: User = Depends(get_admin_user)):
    existing_event = await db.events.find_one({"id": event_id})
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_data.model_dump()
    for date_field in ['start_date', 'end_date']:
        if date_field in update_data:
            update_data[date_field] = update_data[date_field].isoformat()
    
    await db.events.update_one({"id": event_id}, {"$set": update_data})
    
    updated_event = await db.events.find_one({"id": event_id}, {"_id": 0})
    for date_field in ['start_date', 'end_date', 'created_at']:
        if isinstance(updated_event.get(date_field), str):
            updated_event[date_field] = datetime.fromisoformat(updated_event[date_field])
    
    return Event(**updated_event)


@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, admin: User = Depends(get_admin_user)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}


# ==================== REGISTRATIONS ENDPOINTS ====================

@api_router.post("/registrations", response_model=Registration)
async def create_registration(reg_data: RegistrationCreate, current_user: User = Depends(get_current_user)):
    # Check event exists and has available seats
    event = await db.events.find_one({"id": reg_data.event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event['available_seats'] <= 0:
        raise HTTPException(status_code=400, detail="No seats available")
    
    # Check if already registered
    existing_reg = await db.registrations.find_one({
        "event_id": reg_data.event_id,
        "user_id": current_user.id
    })
    if existing_reg:
        raise HTTPException(status_code=400, detail="Already registered for this event")
    
    registration = Registration(
        event_id=reg_data.event_id,
        user_id=current_user.id,
        user_name=current_user.full_name,
        user_email=current_user.email,
        ticket_type=reg_data.ticket_type,
        payment_amount=event['ticket_price']
    )
    
    reg_doc = registration.model_dump()
    reg_doc['registration_date'] = reg_doc['registration_date'].isoformat()
    
    await db.registrations.insert_one(reg_doc)
    
    # Update available seats
    await db.events.update_one(
        {"id": reg_data.event_id},
        {"$inc": {"available_seats": -1}}
    )
    
    return registration


@api_router.get("/registrations/my", response_model=List[Registration])
async def get_my_registrations(current_user: User = Depends(get_current_user)):
    registrations = await db.registrations.find(
        {"user_id": current_user.id},
        {"_id": 0}
    ).to_list(1000)
    
    for reg in registrations:
        if isinstance(reg.get('registration_date'), str):
            reg['registration_date'] = datetime.fromisoformat(reg['registration_date'])
    
    return registrations


@api_router.get("/registrations", response_model=List[Registration])
async def get_all_registrations(admin: User = Depends(get_admin_user)):
    registrations = await db.registrations.find({}, {"_id": 0}).to_list(1000)
    
    for reg in registrations:
        if isinstance(reg.get('registration_date'), str):
            reg['registration_date'] = datetime.fromisoformat(reg['registration_date'])
    
    return registrations


# ==================== AWARDS ENDPOINTS ====================

@api_router.get("/awards", response_model=List[Award])
async def get_awards(status: Optional[str] = None, year: Optional[int] = None):
    query = {}
    if status:
        query['status'] = status
    if year:
        query['year'] = year
    
    awards = await db.awards.find(query, {"_id": 0}).sort("year", -1).to_list(1000)
    
    for award in awards:
        for date_field in ['nomination_start', 'nomination_end', 'created_at']:
            if isinstance(award.get(date_field), str):
                award[date_field] = datetime.fromisoformat(award[date_field])
    
    return awards


@api_router.post("/awards", response_model=Award)
async def create_award(award_data: AwardCreate, admin: User = Depends(get_admin_user)):
    award = Award(**award_data.model_dump())
    
    award_doc = award.model_dump()
    for date_field in ['nomination_start', 'nomination_end', 'created_at']:
        award_doc[date_field] = award_doc[date_field].isoformat()
    
    await db.awards.insert_one(award_doc)
    return award


@api_router.put("/awards/{award_id}", response_model=Award)
async def update_award(award_id: str, award_data: AwardCreate, admin: User = Depends(get_admin_user)):
    existing_award = await db.awards.find_one({"id": award_id})
    if not existing_award:
        raise HTTPException(status_code=404, detail="Award not found")
    
    update_data = award_data.model_dump()
    for date_field in ['nomination_start', 'nomination_end']:
        if date_field in update_data:
            update_data[date_field] = update_data[date_field].isoformat()
    
    await db.awards.update_one({"id": award_id}, {"$set": update_data})
    
    updated_award = await db.awards.find_one({"id": award_id}, {"_id": 0})
    for date_field in ['nomination_start', 'nomination_end', 'created_at']:
        if isinstance(updated_award.get(date_field), str):
            updated_award[date_field] = datetime.fromisoformat(updated_award[date_field])
    
    return Award(**updated_award)


# ==================== NOMINATIONS ENDPOINTS ====================

@api_router.post("/nominations", response_model=Nomination)
async def create_nomination(nom_data: NominationCreate, current_user: User = Depends(get_current_user)):
    # Check award exists and is open
    award = await db.awards.find_one({"id": nom_data.award_id})
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    
    if award['status'] != 'open':
        raise HTTPException(status_code=400, detail="Nominations are closed for this award")
    
    nomination = Nomination(
        **nom_data.model_dump(),
        nominated_by_user_id=current_user.id
    )
    
    nom_doc = nomination.model_dump()
    nom_doc['created_at'] = nom_doc['created_at'].isoformat()
    
    await db.nominations.insert_one(nom_doc)
    return nomination


@api_router.get("/nominations", response_model=List[Nomination])
async def get_nominations(award_id: Optional[str] = None, admin: User = Depends(get_admin_user)):
    query = {}
    if award_id:
        query['award_id'] = award_id
    
    nominations = await db.nominations.find(query, {"_id": 0}).to_list(1000)
    
    for nom in nominations:
        if isinstance(nom.get('created_at'), str):
            nom['created_at'] = datetime.fromisoformat(nom['created_at'])
    
    return nominations


@api_router.get("/nominations/my", response_model=List[Nomination])
async def get_my_nominations(current_user: User = Depends(get_current_user)):
    nominations = await db.nominations.find(
        {"nominated_by_user_id": current_user.id},
        {"_id": 0}
    ).to_list(1000)
    
    for nom in nominations:
        if isinstance(nom.get('created_at'), str):
            nom['created_at'] = datetime.fromisoformat(nom['created_at'])
    
    return nominations


# ==================== SPEAKERS ENDPOINTS ====================

@api_router.get("/speakers", response_model=List[Speaker])
async def get_speakers(featured: Optional[bool] = None):
    query = {}
    if featured is not None:
        query['is_featured'] = featured
    
    speakers = await db.speakers.find(query, {"_id": 0}).to_list(1000)
    
    for speaker in speakers:
        if isinstance(speaker.get('created_at'), str):
            speaker['created_at'] = datetime.fromisoformat(speaker['created_at'])
    
    return speakers


@api_router.get("/speakers/{speaker_id}", response_model=Speaker)
async def get_speaker(speaker_id: str):
    speaker_doc = await db.speakers.find_one({"id": speaker_id}, {"_id": 0})
    if not speaker_doc:
        raise HTTPException(status_code=404, detail="Speaker not found")
    
    if isinstance(speaker_doc.get('created_at'), str):
        speaker_doc['created_at'] = datetime.fromisoformat(speaker_doc['created_at'])
    
    return Speaker(**speaker_doc)


@api_router.post("/speakers", response_model=Speaker)
async def create_speaker(speaker_data: SpeakerCreate, admin: User = Depends(get_admin_user)):
    speaker = Speaker(**speaker_data.model_dump())
    
    speaker_doc = speaker.model_dump()
    speaker_doc['created_at'] = speaker_doc['created_at'].isoformat()
    
    await db.speakers.insert_one(speaker_doc)
    return speaker


@api_router.put("/speakers/{speaker_id}", response_model=Speaker)
async def update_speaker(speaker_id: str, speaker_data: SpeakerCreate, admin: User = Depends(get_admin_user)):
    existing_speaker = await db.speakers.find_one({"id": speaker_id})
    if not existing_speaker:
        raise HTTPException(status_code=404, detail="Speaker not found")
    
    update_data = speaker_data.model_dump()
    await db.speakers.update_one({"id": speaker_id}, {"$set": update_data})
    
    updated_speaker = await db.speakers.find_one({"id": speaker_id}, {"_id": 0})
    if isinstance(updated_speaker.get('created_at'), str):
        updated_speaker['created_at'] = datetime.fromisoformat(updated_speaker['created_at'])
    
    return Speaker(**updated_speaker)


# ==================== SESSIONS ENDPOINTS ====================

@api_router.get("/sessions", response_model=List[Session])
async def get_sessions(event_id: Optional[str] = None):
    query = {}
    if event_id:
        query['event_id'] = event_id
    
    sessions = await db.sessions.find(query, {"_id": 0}).sort("start_time", 1).to_list(1000)
    
    for session in sessions:
        for date_field in ['start_time', 'end_time', 'created_at']:
            if isinstance(session.get(date_field), str):
                session[date_field] = datetime.fromisoformat(session[date_field])
    
    return sessions


@api_router.post("/sessions", response_model=Session)
async def create_session(session_data: SessionCreate, admin: User = Depends(get_admin_user)):
    session = Session(**session_data.model_dump())
    
    session_doc = session.model_dump()
    for date_field in ['start_time', 'end_time', 'created_at']:
        session_doc[date_field] = session_doc[date_field].isoformat()
    
    await db.sessions.insert_one(session_doc)
    return session


# ==================== INQUIRIES ENDPOINTS ====================

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry_data: InquiryCreate):
    inquiry = Inquiry(**inquiry_data.model_dump())
    
    inquiry_doc = inquiry.model_dump()
    inquiry_doc['created_at'] = inquiry_doc['created_at'].isoformat()
    
    await db.inquiries.insert_one(inquiry_doc)
    return inquiry


@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries(admin: User = Depends(get_admin_user)):
    inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for inquiry in inquiries:
        if isinstance(inquiry.get('created_at'), str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    
    return inquiries


# ==================== CALENDAR EXPORT ====================

@api_router.get("/events/{event_id}/calendar")
async def export_event_calendar(event_id: str):
    event_doc = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event_doc:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Parse dates
    for date_field in ['start_date', 'end_date']:
        if isinstance(event_doc.get(date_field), str):
            event_doc[date_field] = datetime.fromisoformat(event_doc[date_field])
    
    # Create calendar
    cal = Calendar()
    cal.add('prodid', '-//TCPWorld Conference//tcpworld.ai//')
    cal.add('version', '2.0')
    
    # Create event
    ical_event = ICalEvent()
    ical_event.add('summary', event_doc['title'])
    ical_event.add('dtstart', event_doc['start_date'])
    ical_event.add('dtend', event_doc['end_date'])
    ical_event.add('description', event_doc['description'])
    ical_event.add('location', f"{event_doc['venue']}, {event_doc['city']}, {event_doc['country']}")
    ical_event.add('uid', event_id)
    
    cal.add_component(ical_event)
    
    return {
        "calendar_data": cal.to_ical().decode('utf-8'),
        "filename": f"{event_doc['title'].replace(' ', '_')}.ics"
    }


# ==================== STATISTICS ENDPOINTS ====================

@api_router.get("/stats/overview")
async def get_overview_stats(admin: User = Depends(get_admin_user)):
    total_events = await db.events.count_documents({})
    upcoming_events = await db.events.count_documents({"status": "upcoming"})
    total_registrations = await db.registrations.count_documents({})
    total_users = await db.users.count_documents({})
    total_speakers = await db.speakers.count_documents({})
    total_awards = await db.awards.count_documents({})
    total_nominations = await db.nominations.count_documents({})
    
    return {
        "total_events": total_events,
        "upcoming_events": upcoming_events,
        "total_registrations": total_registrations,
        "total_users": total_users,
        "total_speakers": total_speakers,
        "total_awards": total_awards,
        "total_nominations": total_nominations
    }


# ==================== ROOT ENDPOINT ====================

@api_router.get("/")
async def root():
    return {"message": "TCPWorld API - Conference and Awards Platform"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
