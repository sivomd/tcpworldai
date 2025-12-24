import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Award, Trophy, Medal, Star, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AwardsPage = () => {
  const { user, token } = useAuth();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [nominationData, setNominationData] = useState({
    nominee_name: '',
    nominee_email: '',
    nominee_organization: '',
    nomination_statement: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await axios.get(`${API}/awards`);
      setAwards(response.data);
    } catch (error) {
      console.error('Error fetching awards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNominate = (award) => {
    if (!user) {
      alert('Please login to nominate');
      return;
    }
    setSelectedAward(award);
    setShowNominationForm(true);
  };

  const handleSubmitNomination = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post(
        `${API}/nominations`,
        { ...nominationData, award_id: selectedAward.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Nomination submitted successfully!');
      setShowNominationForm(false);
      setNominationData({
        nominee_name: '',
        nominee_email: '',
        nominee_organization: '',
        nomination_statement: ''
      });
    } catch (error) {
      alert(error.response?.data?.detail || 'Nomination failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'cybersecurity':
        return <Trophy className="text-blue-600" size={32} />;
      case 'ai':
        return <Star className="text-cyan-600" size={32} />;
      case 'innovation':
        return <Award className="text-purple-600" size={32} />;
      case 'leadership':
        return <Medal className="text-yellow-600" size={32} />;
      default:
        return <Award className="text-gray-600" size={32} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Header */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1650240852447-46505dba4726?w=1200')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl font-bold mb-4" data-testid="awards-page-title">Awards & Recognition</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Celebrating excellence, innovation, and leadership in cybersecurity and artificial intelligence.
          </p>
        </div>
      </section>

      {/* Awards Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading awards...</div>
            </div>
          ) : awards.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">No awards available at the moment.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {awards.map((award) => (
                <div
                  key={award.id}
                  data-testid={`award-card-${award.id}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-8 text-white">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                      {getCategoryIcon(award.category)}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{award.title}</h3>
                    <div className="text-blue-100">{award.category}</div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{award.description}</p>
                    
                    <div className="space-y-2 text-sm mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-semibold">{award.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold ${
                          award.status === 'open' ? 'text-green-600' :
                          award.status === 'closed' ? 'text-orange-600' :
                          'text-blue-600'
                        }`}>
                          {award.status}
                        </span>
                      </div>
                    </div>

                    {award.winner_name && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="text-sm text-yellow-800 font-semibold mb-1">Winner</div>
                        <div className="text-yellow-900">{award.winner_name}</div>
                      </div>
                    )}
                    
                    {award.status === 'open' && (
                      <button
                        onClick={() => handleNominate(award)}
                        data-testid={`nominate-btn-${award.id}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        Nominate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nomination Form Modal */}
      {showNominationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2" data-testid="nomination-form-title">
                Submit Nomination
              </h2>
              <p className="text-gray-600 mb-6">Award: {selectedAward?.title}</p>
              
              <form onSubmit={handleSubmitNomination} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nominee Name *
                  </label>
                  <input
                    type="text"
                    required
                    data-testid="nominee-name-input"
                    value={nominationData.nominee_name}
                    onChange={(e) => setNominationData({ ...nominationData, nominee_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nominee Email *
                  </label>
                  <input
                    type="email"
                    required
                    data-testid="nominee-email-input"
                    value={nominationData.nominee_email}
                    onChange={(e) => setNominationData({ ...nominationData, nominee_email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    required
                    data-testid="nominee-org-input"
                    value={nominationData.nominee_organization}
                    onChange={(e) => setNominationData({ ...nominationData, nominee_organization: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomination Statement *
                  </label>
                  <textarea
                    required
                    rows="5"
                    data-testid="nomination-statement-input"
                    value={nominationData.nomination_statement}
                    onChange={(e) => setNominationData({ ...nominationData, nomination_statement: e.target.value })}
                    placeholder="Why should this person receive this award?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="submit-nomination-btn"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Submit Nomination'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNominationForm(false)}
                    data-testid="cancel-nomination-btn"
                    className="px-6 bg-gray-200 hover:bg-gray-300 text-slate-900 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AwardsPage;