import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Linkedin, Twitter, Briefcase, Award } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SpeakersPage = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await axios.get(`${API}/speakers`);
      setSpeakers(response.data);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Header */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1594938384824-022767a58e11?w=1200')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl font-bold mb-4" data-testid="speakers-page-title">Our Speakers</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Meet the visionary leaders, innovators, and experts shaping the future of cybersecurity and AI.
          </p>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading speakers...</div>
            </div>
          ) : speakers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">No speakers available at the moment.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  data-testid={`speaker-card-${speaker.id}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={speaker.image_url || 'https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg?w=400'}
                      alt={speaker.name}
                      className="w-full h-64 object-cover"
                    />
                    {speaker.is_featured && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{speaker.name}</h3>
                    <div className="flex items-center gap-2 text-blue-600 mb-4">
                      <Briefcase size={16} />
                      <span className="font-semibold">{speaker.title}</span>
                    </div>
                    <div className="text-gray-600 mb-4">{speaker.organization}</div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">{speaker.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {speaker.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t">
                      {speaker.linkedin_url && (
                        <a
                          href={speaker.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                      {speaker.twitter_url && (
                        <a
                          href={speaker.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500 transition-colors"
                        >
                          <Twitter size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SpeakersPage;