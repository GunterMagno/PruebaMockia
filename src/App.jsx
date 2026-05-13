import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Utensils, 
  Info, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  ArrowRight,
  Link2,
  RefreshCw,
  AlertCircle,
  ChefHat,
  X,
  Calendar,
  User,
  CheckCircle2
} from 'lucide-react';
import './App.css';

function App() {
  const [backendUrl, setBackendUrl] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'reservation' | 'dish'
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

  const fetchData = async (url) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    try {
      const [infoRes, menuRes, staffRes] = await Promise.allSettled([
        axios.get(`${baseUrl}/info`),
        axios.get(`${baseUrl}/menu`),
        axios.get(`${baseUrl}/staff`)
      ]);

      if (infoRes.status === 'fulfilled') setRestaurantInfo(infoRes.value.data);
      if (menuRes.status === 'fulfilled') setMenuItems(menuRes.value.data);
      if (staffRes.status === 'fulfilled') setStaffItems(staffRes.value.data);
      
      setBackendUrl(baseUrl);
    } catch (err) {
      setError('Error connecting to backend');
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
      await axios.post(`${backendUrl}/reservations`, resForm);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setActiveModal(null);
      }, 3000);
    } catch (err) {
      setError('Reservation failed. Endpoint /reservations not found?');
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
      {/* Dynamic Control Bar */}
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
          <button type="submit" className="connect-btn" disabled={loading}>
            {loading ? <RefreshCw className="spin" size={18} /> : 'Sync Backend'}
          </button>
        </form>
        {error && <div className="url-error"><AlertCircle size={14} /> {error}</div>}
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content fade-in">
          <span className="welcome-tag">Welcome to</span>
          <h1>{restaurantInfo.name}</h1>
          <p>{restaurantInfo.description}</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}>
              View Menu <ArrowRight size={18} />
            </button>
            <button className="secondary-btn" onClick={() => setActiveModal('reservation')}>Book Table</button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu-section">
        <div className="section-header">
          <Utensils className="accent-icon" />
          <h2>Chef's Selection</h2>
          <div className="header-line"></div>
        </div>

        <div className="menu-grid">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className="menu-card glass-panel fade-in" onClick={() => openDish(item)}>
                <div className="card-img-wrapper">
                  <img src={item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`} alt={item.name} />
                  <div className="category-badge">{item.category}</div>
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <h3>{item.name}</h3>
                    <span className="price">${item.price}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            [1,2,3].map(i => <div key={i} className="skeleton-card glass-panel"></div>)
          )}
        </div>
      </section>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content glass-panel fade-in" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveModal(null)}><X size={24} /></button>
            
            {activeModal === 'reservation' && (
              <div className="reservation-ui">
                <h2>Table Reservation</h2>
                <p>Secure your table at {restaurantInfo.name}</p>
                
                {bookingSuccess ? (
                  <div className="success-state">
                    <CheckCircle2 size={64} color="#d4af37" />
                    <h3>Booking Confirmed!</h3>
                    <p>We look forward to serving you.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReservation} className="modal-form">
                    <div className="form-group">
                      <label><User size={16} /> Full Name</label>
                      <input 
                        type="text" required
                        value={resForm.name} 
                        onChange={e => setResForm({...resForm, name: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label><Calendar size={16} /> Date</label>
                        <input 
                          type="date" required
                          value={resForm.date}
                          onChange={e => setResForm({...resForm, date: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label><Users size={16} /> Guests</label>
                        <select 
                          value={resForm.guests}
                          onChange={e => setResForm({...resForm, guests: e.target.value})}
                        >
                          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Persons</option>)}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="primary-btn submit-btn" disabled={bookingLoading}>
                      {bookingLoading ? <RefreshCw className="spin" /> : 'Confirm Booking'}
                    </button>
                    {!backendUrl && <p className="form-hint">Connect a backend URL to enable booking</p>}
                  </form>
                )}
              </div>
            )}

            {activeModal === 'dish' && selectedDish && (
              <div className="dish-detail">
                <div className="detail-img">
                  <img src={selectedDish.image} alt={selectedDish.name} />
                </div>
                <div className="detail-info">
                  <span className="category">{selectedDish.category}</span>
                  <h2>{selectedDish.name}</h2>
                  <p className="price">${selectedDish.price}</p>
                  <p className="description">{selectedDish.description}</p>
                  <div className="ingredients">
                    <h4>Chef's Note</h4>
                    <p>Prepared with fresh ingredients from our local partners. High in flavor, balanced in nutrition.</p>
                  </div>
                  <button className="primary-btn">Add to Favorites</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staff Section */}
      <section className="staff-section">
        <div className="section-header">
          <ChefHat className="accent-icon" />
          <h2>The Culinary Team</h2>
          <div className="header-line"></div>
        </div>
        <div className="staff-grid">
          {staffItems.map((member, i) => (
            <div key={i} className="staff-card">
              <div className="staff-img">
                <img src={member.photo || `https://images.unsplash.com/photo-1583394238712-92d4499026a4?auto=format&fit=crop&w=400&q=80`} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="gourmet-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>{restaurantInfo.name}</h2>
            <p>{restaurantInfo.description}</p>
          </div>
          <div className="footer-contact">
            <p><Phone size={14} /> {restaurantInfo.phone}</p>
            <p><MapPin size={14} /> {restaurantInfo.address}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Gourmet Hub | Interactive Mockia Template</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
