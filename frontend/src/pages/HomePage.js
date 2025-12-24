import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Award, Users, ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-[600px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?w=1200')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl" data-testid="hero-section">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Leading the Future of
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Cybersecurity & AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Join visionary leaders at world-class conferences and prestigious awards recognizing innovation and excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/events"
                data-testid="view-events-btn"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Events
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/awards"
                data-testid="view-awards-btn"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-slate-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                View Awards
                <Award className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-events">
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300">Global Events</div>
            </div>
            <div data-testid="stat-speakers">
              <div className="text-4xl font-bold text-cyan-400 mb-2">200+</div>
              <div className="text-gray-300">Industry Speakers</div>
            </div>
            <div data-testid="stat-attendees">
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-gray-300">Attendees</div>
            </div>
            <div data-testid="stat-awards">
              <div className="text-4xl font-bold text-cyan-400 mb-2">25+</div>
              <div className="text-gray-300">Award Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why TCPWorld?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A TCPWave initiative bringing together the brightest minds in cybersecurity and artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow" data-testid="feature-conferences">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">World-Class Conferences</h3>
              <p className="text-gray-600">
                Attend prestigious conferences featuring cutting-edge insights, networking opportunities, and thought leadership from industry pioneers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow" data-testid="feature-awards">
              <div className="w-14 h-14 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="text-cyan-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Prestigious Awards</h3>
              <p className="text-gray-600">
                Recognition programs celebrating innovation, leadership, and excellence in cybersecurity and AI domains.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow" data-testid="feature-networking">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-blue-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Elite Networking</h3>
              <p className="text-gray-600">
                Connect with CXOs, innovators, and decision-makers shaping the future of technology and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Sparkles className="mx-auto mb-6" size={48} />
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Elite?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Register today and be part of the most influential gathering of cybersecurity and AI leaders.
          </p>
          <Link
            to="/register"
            data-testid="cta-register-btn"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* TCPWave Connection */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-blue-600" size={32} />
                <h3 className="text-3xl font-bold text-slate-900">A TCPWave Initiative</h3>
              </div>
              <p className="text-gray-600 text-lg mb-6">
                TCPWorld.ai is proudly brought to you by TCPWave, a global leader in DNS security and network automation solutions. Building on decades of innovation, we're creating a platform for the next generation of cybersecurity and AI leaders.
              </p>
              <a
                href="https://tcpwave.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Learn more about TCPWave
                <ArrowRight className="ml-2" size={18} />
              </a>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;