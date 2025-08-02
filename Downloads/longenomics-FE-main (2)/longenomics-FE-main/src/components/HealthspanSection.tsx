import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HealthspanSection.css';

function HealthspanSection() {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    navigate('/join');
  };

  return (
    <section className="lp-healthspan-section">
      <div className="lp-healthspan-content">
        <h2 className="lp-healthspan-title">Take charge of your healthspan</h2>
        <p className="lp-healthspan-description">
          Unify your health data for actionable, AI-powered insights. Track wearables, labs,
          and habits in one timeline. Get personalized recommendations and stay ahead with
          predictive, preventive care.
        </p>
        <button className="lp-button lp-healthspan-button" onClick={handleJoinNow}>Join now</button>
      </div>
      <div className="lp-healthspan-image-top-right">
        <div className="placeholder-image">
          <div className="placeholder-content">
            <div className="placeholder-icon">📱</div>
            <div className="placeholder-text">Health Dashboard</div>
          </div>
        </div>
      </div>
      <div className="lp-healthspan-image-bottom-left">
        <div className="placeholder-image">
          <div className="placeholder-content">
            <div className="placeholder-icon">📊</div>
            <div className="placeholder-text">Analytics</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HealthspanSection;