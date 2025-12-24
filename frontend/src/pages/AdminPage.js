import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, Calendar, Award, Users, MessageSquare, 
  Plus, Edit, Trash2, Eye, Check, X 
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [awards, setAwards] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      if (activeTab === 'overview') {
        const response = await axios.get(`${API}/stats/overview`, { headers });
        setStats(response.data);
      } else if (activeTab === 'events') {
        const response = await axios.get(`${API}/events`, { headers });
        setEvents(response.data);
      } else if (activeTab === 'awards') {
        const response = await axios.get(`${API}/awards`, { headers });
        setAwards(response.data);
      } else if (activeTab === 'speakers') {
        const response = await axios.get(`${API}/speakers`, { headers });
        setSpeakers(response.data);
      } else if (activeTab === 'registrations') {
        const response = await axios.get(`${API}/registrations`, { headers });
        setRegistrations(response.data);
      } else if (activeTab === 'nominations') {
        const response = await axios.get(`${API}/nominations`, { headers });
        setNominations(response.data);
      } else if (activeTab === 'inquiries') {
        const response = await axios.get(`${API}/inquiries`, { headers });
        setInquiries(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await axios.delete(`${API}/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('Deleted successfully');
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="admin-page-title">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your TCPWorld platform</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              data-testid="tab-overview"
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('events')}
              data-testid="tab-events"
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'events'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('awards')}
              data-testid="tab-awards"
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'awards'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Awards
            </button>
            <button
              onClick={() => setActiveTab('speakers')}
              data-testid="tab-speakers"
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'speakers'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Speakers
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              data-testid="tab-registrations"
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'registrations'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Registrations
            </button>
            <button
              onClick={() => setActiveTab('nominations')}
              data-testid="tab-nominations"
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'nominations'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Nominations
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              data-testid="tab-inquiries"
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inquiries
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading...</div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Platform Statistics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="stat-card-events">
                      <div className="flex items-center justify-between mb-4">
                        <Calendar className="text-blue-600" size={32} />
                        <div className="text-3xl font-bold text-slate-900">{stats.total_events || 0}</div>
                      </div>
                      <div className="text-gray-600">Total Events</div>
                      <div className="text-sm text-green-600 mt-2">{stats.upcoming_events || 0} upcoming</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="stat-card-users">
                      <div className="flex items-center justify-between mb-4">
                        <Users className="text-cyan-600" size={32} />
                        <div className="text-3xl font-bold text-slate-900">{stats.total_users || 0}</div>
                      </div>
                      <div className="text-gray-600">Total Users</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="stat-card-registrations">
                      <div className="flex items-center justify-between mb-4">
                        <BarChart3 className="text-blue-600" size={32} />
                        <div className="text-3xl font-bold text-slate-900">{stats.total_registrations || 0}</div>
                      </div>
                      <div className="text-gray-600">Registrations</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="stat-card-awards">
                      <div className="flex items-center justify-between mb-4">
                        <Award className="text-yellow-600" size={32} />
                        <div className="text-3xl font-bold text-slate-900">{stats.total_awards || 0}</div>
                      </div>
                      <div className="text-gray-600">Total Awards</div>
                      <div className="text-sm text-blue-600 mt-2">{stats.total_nominations || 0} nominations</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Manage Events</h2>
                    <button
                      data-testid="create-event-btn"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Create Event
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Seats</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {events.map((event) => (
                            <tr key={event.id} data-testid={`event-row-${event.id}`}>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900">{event.title}</div>
                                <div className="text-sm text-gray-600">{event.event_type}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{formatDate(event.start_date)}</td>
                              <td className="px-6 py-4 text-gray-700">{event.city}, {event.country}</td>
                              <td className="px-6 py-4 text-gray-700">{event.available_seats} / {event.capacity}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                                  event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {event.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button className="text-blue-600 hover:text-blue-700">
                                    <Edit size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete('events', event.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Awards Tab */}
              {activeTab === 'awards' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Manage Awards</h2>
                    <button
                      data-testid="create-award-btn"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Create Award
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {awards.map((award) => (
                      <div key={award.id} data-testid={`award-card-${award.id}`} className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-slate-900">{award.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            award.status === 'open' ? 'bg-green-100 text-green-800' :
                            award.status === 'closed' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {award.status}
                          </span>
                        </div>
                        <div className="text-gray-600 mb-4">{award.category} • {award.year}</div>
                        {award.winner_name && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                            <div className="text-xs text-yellow-800">Winner</div>
                            <div className="font-semibold text-yellow-900">{award.winner_name}</div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                            <Edit size={16} />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete('awards', award.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers Tab */}
              {activeTab === 'speakers' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Manage Speakers</h2>
                    <button
                      data-testid="create-speaker-btn"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Add Speaker
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {speakers.map((speaker) => (
                      <div key={speaker.id} data-testid={`speaker-card-${speaker.id}`} className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img 
                          src={speaker.image_url || 'https://via.placeholder.com/400x300'} 
                          alt={speaker.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{speaker.name}</h3>
                          <div className="text-blue-600 font-semibold mb-2">{speaker.title}</div>
                          <div className="text-gray-600 mb-4">{speaker.organization}</div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg">
                              <Edit size={16} className="inline mr-1" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete('speakers', speaker.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registrations Tab */}
              {activeTab === 'registrations' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Event Registrations</h2>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {registrations.map((reg) => (
                            <tr key={reg.id} data-testid={`registration-row-${reg.id}`}>
                              <td className="px-6 py-4 font-semibold text-slate-900">{reg.user_name}</td>
                              <td className="px-6 py-4 text-gray-700">{reg.user_email}</td>
                              <td className="px-6 py-4 text-gray-700 font-mono text-sm">{reg.event_id.substring(0, 8)}</td>
                              <td className="px-6 py-4 font-semibold text-blue-600">${reg.payment_amount}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  reg.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                                  reg.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {reg.payment_status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{formatDate(reg.registration_date)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Nominations Tab */}
              {activeTab === 'nominations' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Award Nominations</h2>
                  <div className="space-y-4">
                    {nominations.map((nom) => (
                      <div key={nom.id} data-testid={`nomination-row-${nom.id}`} className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{nom.nominee_name}</h3>
                            <div className="text-gray-600">{nom.nominee_organization}</div>
                            <div className="text-sm text-gray-500">{nom.nominee_email}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            nom.status === 'winner' ? 'bg-yellow-100 text-yellow-800' :
                            nom.status === 'approved' ? 'bg-green-100 text-green-800' :
                            nom.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {nom.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{nom.nomination_statement}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          Submitted: {formatDate(nom.created_at)}
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2">
                            <Check size={16} />
                            Approve
                          </button>
                          <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inquiries Tab */}
              {activeTab === 'inquiries' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Inquiries</h2>
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} data-testid={`inquiry-row-${inquiry.id}`} className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{inquiry.subject}</h3>
                            <div className="text-gray-600">{inquiry.name} • {inquiry.email}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            inquiry.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            inquiry.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{inquiry.message}</p>
                        <div className="text-sm text-gray-500">
                          Received: {formatDate(inquiry.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminPage;
