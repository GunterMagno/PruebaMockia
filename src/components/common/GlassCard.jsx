import React from 'react';
import { ExternalLink } from 'lucide-react';
import './GlassCard.css';

const GlassCard = ({ title, description, image, category, price, onClick, endpoint }) => {
  return (
    <div className="glass-card-wrapper fade-in" onClick={onClick}>
      <div className="glass-card">
        <div className="card-image-section">
          <img src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={title} />
          <div className="card-badge">{category}</div>
          {endpoint && (
            <div className="endpoint-marker" title={`Consumes: ${endpoint}`}>
              <ExternalLink size={12} /> {endpoint}
            </div>
          )}
        </div>
        <div className="card-content-section">
          <div className="card-header-row">
            <h3>{title}</h3>
            {price && <span className="card-price">${price}</span>}
          </div>
          <p className="card-desc">{description}</p>
          <div className="card-footer-row">
            <button className="view-details-btn">View Details</button>
          </div>
        </div>
      </div>
      <div className="card-glow"></div>
    </div>
  );
};

export default GlassCard;
