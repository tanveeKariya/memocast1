import React from 'react';
import './UserStories.css'; 

const UserStories = () => {
  const testimonials = [
    {
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Avery Lin',
      company: 'HealthSync',
      quote: 'The health timeline gave me clear, actionable steps for prevention.',
      tag: 'HealthSync',
    },
    {
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Jordan Ellis',
      company: 'WellFusion',
      quote: 'Unified data from wearables and labs made my health progress easy to track.',
      tag: 'WellFusion',
    },
    {
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Morgan Shaw',
      company: 'InsightVitals',
      quote: 'AI insights helped me prioritize preventive care in my routine.',
      tag: 'InsightVitals',
    },
    {
      avatar: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Taylor Reed',
      company: 'BioTrack',
      quote: 'Digital twin features keep me focused on my wellness goals.',
      tag: 'BioTrack',
    },
    {
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Casey Drew',
      company: 'OptiWell',
      quote: 'I finally have a long-term, personalized health plan.',
      tag: 'OptiWell',
    },
    {
      avatar: 'https://images.pexels.com/photos/3763189/pexels-photo-3763189.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Riley Fox',
      company: 'PulseMetrics',
      quote: 'Centralized health data streamlined my daily routine.',
      tag: 'PulseMetrics',
    },
    {
      avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Skyler James',
      company: 'LifeSpanIQ',
      quote: 'Recommendations are clear, relevant, and easy to follow.',
      tag: 'LifeSpanIQ',
    },
    {
      avatar: 'https://images.pexels.com/photos/3785078/pexels-photo-3785078.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      name: 'Emerson Blake',
      company: 'CoreVitals',
      quote: 'Collaboration tools make sharing progress with my care team simple.',
      tag: 'CoreVitals',
    },
  ];

  return (
    <section className="lp-user-stories-section">
      <div className="lp-section-header lp-user-stories-header">
        <p className="lp-user-stories-subtitle">USER STORIES</p>
        <h2 className="lp-section-title lp-user-stories-title">Personalized health, proven results</h2>
        <p className="lp-section-description lp-user-stories-description">See how professionals use data-driven insights to improve their long-term health.</p>
      </div>
      {/* <div className="lp-testimonial-cards-grid">
        {testimonials.map((testimonial, index) => (
          <div className="lp-testimonial-card" key={index}>
            <div className="lp-testimonial-header">
              <img src={testimonial.avatar} alt={testimonial.name} className="lp-testimonial-avatar" />
              <div className="lp-testimonial-info">
                <h4 className="lp-testimonial-name">{testimonial.name}</h4>
                <p className="lp-testimonial-company">{testimonial.company}</p>
              </div>
            </div>
            <p className="lp-testimonial-quote">"{testimonial.quote}"</p>
            <p className="lp-testimonial-tag">{testimonial.tag}</p>
          </div>
        ))}
      </div> */}
      <div className="text-center mt-12">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
          Join now
        </button>
      </div>
    </section>
  );
};

export default UserStories;