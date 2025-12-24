# TCPWorld.ai - Conference & Awards Platform

A comprehensive, modern web application for hosting conferences and awards for visionary leaders in cybersecurity and AI. Built with FastAPI, React, and MongoDB.

---

## 🌟 Features

### Core Functionality
- **Event Management**: Create, manage, and register for conferences, workshops, and webinars
- **Awards System**: Nomination and recognition programs for industry leaders
- **Speaker Profiles**: Showcase industry experts and thought leaders
- **User Dashboard**: Track registrations, nominations, and profile information
- **Admin Panel**: Complete management interface for all platform operations
- **Contact System**: Inquiry management for communication
- **Calendar Integration**: Export events to personal calendars (.ics format)

### User Roles
- **Public**: Browse events, speakers, and awards
- **Attendee**: Register for events, submit nominations
- **Speaker**: Featured profiles with expertise and social links
- **Admin**: Full platform management capabilities

---

## 🏗️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: Bcrypt
- **Calendar**: iCalendar library

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **HTTP Client**: Axios
- **Icons**: Lucide React

---

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py           # Main FastAPI application
│   ├── create_admin.py     # Admin user creation script
│   ├── seed_data.py        # Database seeding script
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── App.js                    # Main application component
│   │   ├── context/
│   │   │   └── AuthContext.js       # Authentication context
│   │   ├── components/
│   │   │   ├── Navbar.js            # Navigation bar
│   │   │   └── Footer.js            # Footer component
│   │   └── pages/
│   │       ├── HomePage.js          # Landing page
│   │       ├── EventsPage.js        # Events listing
│   │       ├── EventDetailPage.js   # Event details
│   │       ├── AwardsPage.js        # Awards & nominations
│   │       ├── SpeakersPage.js      # Speaker showcase
│   │       ├── LoginPage.js         # User login
│   │       ├── RegisterPage.js      # User registration
│   │       ├── DashboardPage.js     # User dashboard
│   │       ├── AdminPage.js         # Admin panel
│   │       └── ContactPage.js       # Contact form
│   ├── package.json        # Node dependencies
│   └── .env                # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB
- Yarn package manager

### Backend Setup

1. **Install dependencies**:
```bash
cd /app/backend
pip install -r requirements.txt
```

2. **Create admin user**:
```bash
python create_admin.py
```

3. **Seed sample data** (optional):
```bash
python seed_data.py
```

4. **Start backend**:
```bash
sudo supervisorctl restart backend
```

### Frontend Setup

1. **Install dependencies**:
```bash
cd /app/frontend
yarn install
```

2. **Start frontend**:
```bash
sudo supervisorctl restart frontend
```

### Verify Services
```bash
sudo supervisorctl status
```

---

## 🔐 Default Credentials

**Admin Account**:
- Email: `admin@tcpworld.ai`
- Password: `admin123`

⚠️ **Important**: Change the admin password after first login!

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get event details
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/{id}` - Update event (Admin)
- `DELETE /api/events/{id}` - Delete event (Admin)
- `GET /api/events/{id}/calendar` - Export event to calendar

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/my` - Get user's registrations
- `GET /api/registrations` - Get all registrations (Admin)

### Awards
- `GET /api/awards` - List all awards
- `POST /api/awards` - Create award (Admin)
- `PUT /api/awards/{id}` - Update award (Admin)

### Nominations
- `POST /api/nominations` - Submit nomination
- `GET /api/nominations/my` - Get user's nominations
- `GET /api/nominations` - Get all nominations (Admin)

### Speakers
- `GET /api/speakers` - List all speakers
- `GET /api/speakers/{id}` - Get speaker details
- `POST /api/speakers` - Add speaker (Admin)
- `PUT /api/speakers/{id}` - Update speaker (Admin)

### Sessions
- `GET /api/sessions` - List sessions (by event_id)
- `POST /api/sessions` - Create session (Admin)

### Inquiries
- `POST /api/inquiries` - Submit contact inquiry
- `GET /api/inquiries` - Get all inquiries (Admin)

### Statistics
- `GET /api/stats/overview` - Platform statistics (Admin)

---

## 🎨 Design Features

### Mobile Responsive
- Fully responsive design for all screen sizes
- Mobile-optimized navigation
- Touch-friendly interfaces

### Modern UI/UX
- Clean, professional corporate design
- Smooth transitions and animations
- Intuitive navigation
- Accessible components

### Color Scheme
- Primary: Blue (600-700)
- Secondary: Cyan (400-600)
- Accent: Slate (900)
- Success: Green
- Warning: Yellow
- Error: Red

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=tcpworld
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=*
```

**Frontend (.env)**:
```env
REACT_APP_BACKEND_URL=your-backend-url
```

---

## 🌐 Features by Page

### Home Page
- Hero section with call-to-action
- Platform statistics
- Feature highlights
- TCPWave connection section

### Events Page
- Event listing with filters
- Featured events
- Status indicators (upcoming/ongoing/completed)
- Quick registration

### Event Detail Page
- Full event information
- Session schedule
- Registration functionality
- Calendar export
- Seat availability

### Awards Page
- Award categories
- Nomination form
- Status tracking
- Winner announcements

### Speakers Page
- Speaker profiles
- Expertise tags
- Social media links
- Featured speakers

### Dashboard
- User profile information
- Event registrations
- Nomination submissions
- Payment status tracking

### Admin Panel
- Platform statistics
- Event management
- Award management
- Speaker management
- Registration tracking
- Nomination review
- Inquiry management

---

## 📱 Mobile Support

The platform is fully optimized for mobile devices:
- Responsive layouts
- Touch-optimized navigation
- Mobile-friendly forms
- Optimized images
- Fast loading times

---

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (RBAC)
- CORS protection
- Input validation
- XSS protection
- CSRF protection

---

## 🚦 Service Management

### Start all services
```bash
sudo supervisorctl restart all
```

### Check service status
```bash
sudo supervisorctl status
```

### View logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.out.log

# Frontend logs
tail -f /var/log/supervisor/frontend.out.log
```

---

## 🎯 Future Enhancements

### Payment Integration
- PayPal integration for ticket purchases
- Stripe payment gateway
- Invoice generation

### Email Notifications
- Registration confirmations
- Event reminders
- Award notifications
- Newsletter system

### Advanced Features
- Live streaming integration
- Virtual event support
- Attendee networking
- Mobile app development
- Analytics dashboard
- Multi-language support

---

## 🤝 About TCPWorld

TCPWorld.ai is a proud initiative of **TCPWave**, a global leader in DNS security and network automation solutions. Building on decades of innovation, we're creating a platform for the next generation of cybersecurity and AI leaders.

Learn more: [tcpwave.com](https://tcpwave.com)

---

## 📄 License

Copyright © 2025 TCPWorld.ai - A TCPWave Initiative. All rights reserved.

---

## 🆘 Support

For support and inquiries:
- Email: info@tcpworld.ai
- Phone: +1 (555) 123-4567
- Website: tcpworld.ai

---

Built with ❤️ for the cybersecurity and AI community
