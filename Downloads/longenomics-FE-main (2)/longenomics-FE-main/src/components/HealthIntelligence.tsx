import React, { useState } from 'react';
import './HealthIntelligence.css';

const HealthIntelligence = () => {
  const [activeTab, setActiveTab] = useState('All');

  const generatePlaceholderImage = (type, index) => {
    const icons = {
      'Wearables': '⌚',
      'AI': '🤖',
      'Collaboration': '🤝',
      'Future Health': '🔮',
      'AI Insights': '💡',
      'Wellness Tracking': '💪',
      'Mind-Body Connection': '🧘'
    };
    
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ];
    
    return {
      background: colors[index % colors.length],
      icon: icons[type] || '📊'
    };
  };

  const tabContent = {
    All: [
      {
        type: 'Wearables',
        title: 'Gamified Digital Twins: real-time health tracking',
        description: 'See how digital twins use wearable and lab data to enable proactive, personalized care.',
        authorName: 'Drew Ellis',
        date: 'Apr 12, 2023',
      },
      {
        type: 'AI',
        title: 'AI for personalized healthspan',
        description: 'AI powers tailored health advice and risk prediction for improved outcomes.',
        authorName: 'Jordan Avery',
        date: 'Mar 28, 2024',
      },
      {
        type: 'Collaboration',
        title: 'Empowering precision health collaboration',
        description: 'Seamlessly connect and share insights with your care team and researchers.',
        authorName: 'Chris Green',
        date: 'Feb 01, 2023',
      },
      {
        type: 'Future Health',
        title: 'Shaping your future with predictive insights',
        description: 'Proactive steps today for a healthier, longer tomorrow.',
        authorName: 'Sophia Chen',
        date: 'Jan 15, 2024',
      },
    ],
    Longevity: [
      {
        type: 'Wearables',
        title: 'Gamified Digital Twins: real-time health tracking for longevity',
        description: 'Leverage wearable data for proactive, personalized care to extend your healthy lifespan.',
        authorName: 'Drew Ellis',
        date: 'Apr 12, 2023',
      },
      {
        type: 'Future Health',
        title: 'Long-term health strategies with AI',
        description: 'AI-driven insights for sustainable wellness and longevity planning.',
        authorName: 'Sophia Chen',
        date: 'Jan 15, 2024',
      },
    ],
    AI: [
      {
        type: 'AI',
        title: 'AI for personalized healthspan',
        description: 'AI powers tailored health advice and risk prediction for improved outcomes.',
        authorName: 'Jordan Avery',
        date: 'Mar 28, 2024',
      },
      {
        type: 'AI Insights',
        title: 'Predictive analytics for early detection',
        description: 'Harness the power of AI to anticipate health risks before they emerge.',
        authorName: 'Dr. Alex Lee',
        date: 'Mar 05, 2024',
      },
    ],
    Wellness: [
      {
        type: 'Wellness Tracking',
        title: 'Holistic wellness through unified data',
        description: 'Integrate all aspects of your lifestyle for comprehensive wellness tracking.',
        authorName: 'Sarah Kim',
        date: 'May 20, 2023',
      },
      {
        type: 'Mind-Body Connection',
        title: 'Optimizing mental and physical well-being',
        description: 'Guidance and tools to achieve balanced health and vitality.',
        authorName: 'Michael Brown',
        date: 'Apr 01, 2024',
      },
    ],
  };

  const currentContent = tabContent[activeTab] || tabContent['All'];

  return (
    <section className="health-intelligence-section">
      <p className="latest-health-text">LATEST HEALTH INTELLIGENCE</p>
      <h2 className="section-title">Your health, your data, your future</h2>
      <p className="section-description">
        Stay informed with updates on digital twins, AI-driven health, and personalized wellness innovation.
      </p>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'All' ? 'active' : ''}`}
          onClick={() => setActiveTab('All')}
        >
          All
        </button>
        <button
          className={`tab-button ${activeTab === 'Longevity' ? 'active' : ''}`}
          onClick={() => setActiveTab('Longevity')}
        >
          Longevity
        </button>
        <button
          className={`tab-button ${activeTab === 'AI' ? 'active' : ''}`}
          onClick={() => setActiveTab('AI')}
        >
          AI
        </button>
        <button
          className={`tab-button ${activeTab === 'Wellness' ? 'active' : ''}`}
          onClick={() => setActiveTab('Wellness')}
        >
          Wellness
        </button>
      </div>

      <div className="content-grid">
        {currentContent.map((item, index) => {
          const placeholderStyle = generatePlaceholderImage(item.type, index);
          return (
            <div className="content-card" key={index}>
              <div className="card-image-wrapper">
                <div 
                  className="placeholder-card-image"
                  style={{ background: placeholderStyle.background }}
                >
                  <div className="placeholder-card-content">
                    <div className="placeholder-card-icon">{placeholderStyle.icon}</div>
                    <div className="placeholder-card-text">{item.type}</div>
                  </div>
                </div>
              </div>
              <div className="card-content-type">{item.type}</div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>
              <div className="card-author-info">
                <div className="author-avatar-placeholder">
                  {item.authorName.charAt(0)}
                </div>
                <div className="author-text">
                  <span className="author-name">{item.authorName}</span>
                  <span className="post-date">{item.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HealthIntelligence;