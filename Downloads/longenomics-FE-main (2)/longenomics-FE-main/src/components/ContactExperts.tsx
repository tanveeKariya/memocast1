import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactExperts.css';

const ContactExperts = () => {
  const navigate = useNavigate();

  const handleConnect = () => {
    navigate('/contact');
  };

  const handleSupport = () => {
    navigate('/support');
  };

  return (
    <div className="contact-experts-container">
      <h1>Get in touch with experts</h1>
      <div className="cards-wrapper">
        <div className="card">
          <div className="card-image-placeholder" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="placeholder-content">
              <div className="placeholder-icon">💼</div>
              <div className="placeholder-text">Business Team</div>
            </div>
          </div>
          <div className="card-content">
            <h2>Talk to our team</h2>
            <p>
              Reach out for platform details, pricing, or tailored solutions.
            </p>
            <button
              className="card-button"
              onClick={handleConnect}
            >
              Connect
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-image-placeholder" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            <div className="placeholder-content">
              <div className="placeholder-icon">🎧</div>
              <div className="placeholder-text">Support Center</div>
            </div>
          </div>
          <div className="card-content">
            <h2>Need support?</h2>
            <p>
              Browse our Help Center or visit the Community for guidance and answers.
            </p>
            <button
              className="card-button"
              onClick={handleSupport}
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactExperts;