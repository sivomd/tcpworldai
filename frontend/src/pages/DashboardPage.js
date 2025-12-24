import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Award, User, Mail, Building, Phone } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [regsResponse, nomsResponse] = await Promise.all([
        axios.get(`${API}/registrations/my`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/nominations/my`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setRegistrations(regsResponse.data);
      setNominations(nomsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      <section className="py-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="dashboard-title">My Dashboard</h1>
          <p className="text-blue-100">Welcome back, {user?.full_name}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Full Name</div>
                  <div className="font-semibold">{user?.full_name}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-semibold">{user?.email}</div>
                </div>
              </div>
              
              {user?.organization && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Organization</div>
                    <div className="font-semibold">{user.organization}</div>
                  </div>
                </div>
              )}
              
              {user?.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-semibold">{user.phone}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                Role: {user?.role}
              </div>
            </div>
          </div>

          {/* My Registrations */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="text-blue-600" size={28} />
              My Event Registrations
            </h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading...</div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                You haven't registered for any events yet.
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    data-testid={`registration-${reg.id}`}
                    className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg text-slate-900 mb-2">
                          Registration ID: {reg.id.substring(0, 8)}
                        </div>
                        <div className="text-gray-600">Event ID: {reg.event_id}</div>
                        <div className="text-sm text-gray-500 mt-2">
                          Registered on: {formatDate(reg.registration_date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${reg.payment_amount}
                        </div>
                        <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          reg.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                          reg.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reg.payment_status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Nominations */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Award className="text-blue-600" size={28} />
              My Award Nominations
            </h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading...</div>
            ) : nominations.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                You haven't submitted any nominations yet.
              </div>
            ) : (
              <div className="space-y-4">
                {nominations.map((nom) => (
                  <div
                    key={nom.id}
                    data-testid={`nomination-${nom.id}`}
                    className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-slate-900 mb-2">
                          {nom.nominee_name}
                        </div>
                        <div className="text-gray-600 mb-1">{nom.nominee_organization}</div>
                        <div className="text-sm text-gray-500">{nom.nominee_email}</div>
                        <div className="text-sm text-gray-500 mt-2">
                          Submitted on: {formatDate(nom.created_at)}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        nom.status === 'winner' ? 'bg-yellow-100 text-yellow-800' :
                        nom.status === 'approved' ? 'bg-green-100 text-green-800' :
                        nom.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {nom.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DashboardPage;