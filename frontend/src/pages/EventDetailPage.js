import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Calendar, MapPin, Users, DollarSign, Clock, Download, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchSessions();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${API}/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API}/sessions`, {
        params: { event_id: id }
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      await axios.post(
        `${API}/registrations`,
        { event_id: id, ticket_type: 'standard' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegistered(true);
      alert('Registration successful!');
    } catch (error) {
      alert(error.response?.data?.detail || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleDownloadCalendar = async () => {
    try {
      const response = await axios.get(`${API}/events/${id}/calendar`);
      const blob = new Blob([response.data.calendar_data], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading calendar:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl">Event not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Hero */}
      <section 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${event.image_url || 'https://images.pexels.com/photos/35335992/pexels-photo-35335992.jpeg'}')`
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              event.status === 'upcoming' ? 'bg-green-500' :
              event.status === 'ongoing' ? 'bg-blue-500' :
              'bg-gray-500'
            }`}>
              {event.status}
            </div>
            <h1 className="text-5xl font-bold mb-4" data-testid="event-title">{event.title}</h1>
            <p className="text-xl text-gray-200">{event.event_type}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">About This Event</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {event.description}
                </p>
                
                {event.agenda && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Agenda</h3>
                    <p className="text-gray-700 whitespace-pre-line">{event.agenda}</p>
                  </div>
                )}
              </div>

              {/* Sessions */}
              {sessions.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Event Sessions</h2>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="border-l-4 border-blue-600 pl-6 py-4"
                        data-testid={`session-${session.id}`}
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Clock size={16} />
                          <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                          <span className="ml-4">{session.room}</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{session.title}</h4>
                        <p className="text-gray-600">{session.description}</p>
                        <div className="mt-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                            {session.session_type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-20">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-blue-600" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Date</div>
                      <div className="font-semibold">{formatDate(event.start_date)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-semibold">{event.venue}</div>
                      <div className="text-sm text-gray-600">{event.city}, {event.country}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="text-blue-600" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Available Seats</div>
                      <div className="font-semibold">{event.available_seats} / {event.capacity}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-blue-600" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Ticket Price</div>
                      <div className="text-2xl font-bold text-blue-600">${event.ticket_price}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-3">
                  {registered ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
                      <CheckCircle size={20} />
                      <span className="font-semibold">You're registered!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering || event.available_seats === 0}
                      data-testid="register-event-btn"
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      {registering ? 'Registering...' : 
                       event.available_seats === 0 ? 'Sold Out' : 'Register Now'}
                    </button>
                  )}
                  
                  <button
                    onClick={handleDownloadCalendar}
                    data-testid="download-calendar-btn"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-slate-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetailPage;