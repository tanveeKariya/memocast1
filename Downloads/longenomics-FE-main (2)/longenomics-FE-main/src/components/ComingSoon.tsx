import React from 'react';
import { Link } from 'react-router-dom';
import './ComingSoon.css';

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">
          <div className="icon-placeholder">
            <span className="icon-emoji">🚀</span>
          </div>
        </div>
        
        <h1 className="coming-soon-title">{title}</h1>
        <h2 className="coming-soon-subtitle">Coming Soon</h2>
        
        <p className="coming-soon-description">
          We're working hard to bring you an amazing {title.toLowerCase()} experience. 
          Stay tuned for updates and be the first to know when we launch!
        </p>
        
        <div className="coming-soon-features">
          <div className="feature-item">
            <div className="feature-icon">✨</div>
            <span>Innovative Features</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <span>Secure & Private</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <span>Lightning Fast</span>
          </div>
        </div>
        
        <div className="coming-soon-actions">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
          <Link to="/contact" className="btn-secondary">
            Get Notified
          </Link>
        </div>
      </div>
      
      <div className="coming-soon-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
    </div>
  );
};

export default ComingSoon;