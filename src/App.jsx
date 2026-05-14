import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Utensils, 
  Info, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowRight,
  Link2,
  RefreshCw,
  AlertCircle,
  ChefHat,
  X,
  Calendar,
  User,
  CheckCircle2,
  LayoutGrid,
  ShieldCheck
} from 'lucide-react';
import GlassCard from './components/common/GlassCard';
import DiscoveryPanel from './components/scanner/DiscoveryPanel';
import './App.css';

function App() {
  const [backendUrl, setBackendUrl] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manifestData, setManifestData] = useState(null);
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Reservation form state
  const [resForm, setResForm] = useState({ name: '', date: '', guests: 2 });

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Gourmet Hub',
    description: 'Connecting your backend to fine dining experience. Enter a Mockia URL to start.',
    openingHours: 'Mon-Sun: 12:00 - 23:00',
    address: '123 Mock Street, API City',
    phone: '+1 234 MOCKIA'
  });
  
  const [menuItems, setMenuItems] = useState([]);
  const [staffItems, setStaffItems] = useState([]);
  
  // Endpoints status for Discovery Panel
  const [endpoints, setEndpoints] = useState([
    { method: 'GET', path: '/info', description: 'Restaurant metadata', status: 'pending' },
    { method: 'GET', path: '/menu', description: 'List of available dishes', status: 'pending' },
    { method: 'GET', path: '/staff', description: 'Culinary team information', status: 'pending' },
    { method: 'POST', path: '/reservations', description: 'Book a table', status: 'pending' }
  ]);

  const updateEndpointStatus = (path, status) => {
    setEndpoints(prev => prev.map(ep => ep.path === path ? { ...ep, status } : ep));
  };

  const fetchData = async (url) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    const headers = {
      'X-Mockia-API-Key': apiKey,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    const t = Date.now();

    try {
      // Try to fetch manifest/discovery info if available
      try {
        const manifestRes = await axios.get(`${baseUrl}/manifest?_t=${t}`, { headers });
        setManifestData(manifestRes.data);
      } catch (e) {
        // Manifest not found, we'll use the hardcoded discovery list
        setManifestData({
          info: "Standard Mockia Endpoints Detected",
          endpoints: endpoints.map(e => `${e.method} ${e.path}`)
        });
      }

      const [infoRes, menuRes, staffRes] = await Promise.allSettled([
        axios.get(`${baseUrl}/info?_t=${t}`, { headers }),
        axios.get(`${baseUrl}/menu?_t=${t}`, { headers }),
        axios.get(`${baseUrl}/staff?_t=${t}`, { headers })
      ]);

      if (infoRes.status === 'fulfilled') {
        setRestaurantInfo(infoRes.value.data);
        updateEndpointStatus('/info', 'success');
      } else updateEndpointStatus('/info', 'error');

      if (menuRes.status === 'fulfilled') {
        setMenuItems(menuRes.value.data);
        updateEndpointStatus('/menu', 'success');
      } else updateEndpointStatus('/menu', 'error');

      if (staffRes.status === 'fulfilled') {
        setStaffItems(staffRes.value.data);
        updateEndpointStatus('/staff', 'success');
      } else updateEndpointStatus('/staff', 'error');
      
      setBackendUrl(baseUrl);
    } catch (err) {
      setError('Error connecting to backend. Check your URL and API Key.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (e) => {
    e.preventDefault();
    fetchData(tempUrl);
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    if (!backendUrl) return;
    setBookingLoading(true);
    try {
      await axios.post(`${backendUrl}/reservations`, resForm, {
        headers: { 'X-Mockia-API-Key': apiKey }
      });
      setBookingSuccess(true);
      updateEndpointStatus('/reservations', 'success');
      setTimeout(() => {
        setBookingSuccess(false);
        setActiveModal(null);
      }, 3000);
    } catch (err) {
      updateEndpointStatus('/reservations', 'error');
      setError('Reservation failed. Check your API Key or endpoint.');
    } finally {
      setBookingLoading(false);
    }
  };

  const openDish = (dish) => {
    setSelectedDish(dish);
    setActiveModal('dish');
  };

  return (
    <div className="gourmet-app">
      {/* Standalone Control Bar - Restored to original layout */}
      <div className="control-bar glass-panel">
        <form onSubmit={handleConnect} className="url-form">
          <div className="input-wrapper">
            <Link2 size={18} className="input-icon" />
            <input 
              type="text" 
              placeholder="Enter Mockia Backend URL" 
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
            />
          </div>
          <div className="input-wrapper key-input">
            <ShieldCheck size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="X-Mockia-API-Key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <button type="submit" className="connect-btn" disabled={loading}>
            {loading ? <RefreshCw className="spin" size={18} /> : 'Sync Backend'}
          </button>
        </form>
        {error && <div className="url-error"><AlertCircle size={14} /> {error}</div>}
      </div>

      {/* Hero Section - Restored with Background Support */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content fade-in">
          <div className="hero-tag">
            <span className="dot"></span> 
            Premium Experience
          </div>
          <h1>Crafting Digital <span>Dining</span></h1>
          <p>{restaurantInfo.description}</p>
          <div className="hero-actions">
            <button className="cta-primary" onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}>
              Explore Menu <ArrowRight size={18} />
            </button>
            <button className="cta-secondary" onClick={() => setActiveModal('reservation')}>Book a Table</button>
          </div>
        </div>
      </section>

      {/* Separate Interface for Cards (The "Scanner" Grid) */}
      <section id="menu" className="cards-interface">
        <div className="interface-header">
          <div className="header-info">
            <LayoutGrid className="accent-icon" />
            <h2>Interactive Menu Engine</h2>
            <p>Scanning dynamic data from {backendUrl || 'Default Mock'}</p>
          </div>
          <div className="header-status">
            <div className="status-item">
              <span className="label">Items Detected:</span>
              <span className="value">{menuItems.length}</span>
            </div>
          </div>
        </div>

        <div className="grid-container">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <GlassCard 
                key={item.id}
                title={item.name}
                description={item.description}
                image={item.image}
                category={item.category}
                price={item.price}
                onClick={() => openDish(item)}
                endpoint="/menu"
              />
            ))
          ) : (
            [1,2,3,4,5,6].map(i => <div key={i} className="skeleton-item glass-panel"></div>)
          )}
        </div>
      </section>

      {/* Culinary Team */}
      <section className="team-section">
        <div className="section-title">
          <ChefHat size={32} color="var(--primary)" />
          <h2>The Team</h2>
        </div>
        <div className="team-grid">
          {staffItems.map((member, i) => (
            <div key={i} className="team-member-card glass-panel fade-in">
              <div className="member-photo">
                <img src={member.photo || `https://images.unsplash.com/photo-1583394238712-92d4499026a4`} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <span className="role">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>{restaurantInfo.name}</h2>
            <p>{restaurantInfo.description}</p>
          </div>
          <div className="footer-info">
            <div className="info-node"><Phone size={16} /> {restaurantInfo.phone}</div>
            <div className="info-node"><MapPin size={16} /> {restaurantInfo.address}</div>
          </div>
        </div>
      </footer>

      {/* Discovery Panel - Automated Scanner Support */}
      <DiscoveryPanel endpoints={endpoints} backendUrl={backendUrl} manifestData={manifestData} />

      {/* Modals - Improved */}
      {activeModal && (
        <div className="modal-root" onClick={() => setActiveModal(null)}>
          <div className="modal-frame glass-panel fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}><X /></button>
            
            {activeModal === 'reservation' && (
              <div className="res-flow">
                <h2>Secure Your Table</h2>
                {bookingSuccess ? (
                  <div className="booking-done">
                    <CheckCircle2 size={64} className="success-icon" />
                    <h3>Confirmed!</h3>
                    <p>Redirecting back...</p>
                  </div>
                ) : (
                  <form onSubmit={handleReservation} className="res-form">
                    <div className="res-group">
                      <label><User size={14} /> Name</label>
                      <input 
                        type="text" required 
                        value={resForm.name}
                        onChange={e => setResForm({...resForm, name: e.target.value})}
                      />
                    </div>
                    <div className="res-row">
                      <div className="res-group">
                        <label><Calendar size={14} /> Date</label>
                        <input 
                          type="date" required
                          value={resForm.date}
                          onChange={e => setResForm({...resForm, date: e.target.value})}
                        />
                      </div>
                      <div className="res-group">
                        <label><Users size={14} /> Guests</label>
                        <select 
                          value={resForm.guests}
                          onChange={e => setResForm({...resForm, guests: e.target.value})}
                        >
                          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Persons</option>)}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="res-submit" disabled={bookingLoading || !backendUrl}>
                      {bookingLoading ? <RefreshCw className="spin" /> : 'Confirm Reservation'}
                    </button>
                    {!backendUrl && <p className="res-error"><AlertCircle size={12} /> Backend required</p>}
                  </form>
                )}
              </div>
            )}

            {activeModal === 'dish' && selectedDish && (
              <div className="dish-profile">
                <div className="profile-img">
                  <img src={selectedDish.image} alt={selectedDish.name} />
                </div>
                <div className="profile-data">
                  <span className="badge">{selectedDish.category}</span>
                  <h2>{selectedDish.name}</h2>
                  <span className="price">${selectedDish.price}</span>
                  <p>{selectedDish.description}</p>
                  <div className="profile-meta">
                    <h4>Consumes Endpoint: <code>/menu</code></h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
