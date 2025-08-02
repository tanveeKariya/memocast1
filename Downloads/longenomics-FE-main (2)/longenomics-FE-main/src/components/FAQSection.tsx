import React from 'react';
import './FAQSection.css';

const FAQSection = () => {
  return (
    <section id="faqs" className="lp-faq-section">
      <div className="lp-section-header lp-faq-header">
        <p className="lp-faq-subtitle">FAQ</p>
        <h2 className="lp-section-title lp-faq-title">Your longevity, clearly explained</h2>
        <p className="lp-section-description lp-faq-description">Get straightforward answers about digital twins, AI insights, and personalized health data.</p>
      </div>
      <div className="lp-faq-items-container">
        <div className="lp-faq-item">
          <h4 className="lp-faq-question">What is a health digital twin?</h4>
          <p className="lp-faq-answer">A health digital twin is a virtual model of your body, built from your wearable, lab, and lifestyle data. It helps track and predict your health over time.</p>
        </div>
        <div className="lp-faq-item">
          <h4 className="lp-faq-question">How does AI tailor my insights?</h4>
          <p className="lp-faq-answer">AI reviews your health data and applies proven rules to deliver personalized recommendations and risk assessments for your wellness.</p>
        </div>
        <div className="lp-faq-item">
          <h4 className="lp-faq-question">Which data sources can I use?</h4>
          <p className="lp-faq-answer">Supported sources include wearables, lab results, and behavior tracking. This combined data gives a complete view for better guidance.</p>
        </div>
        <div className="lp-faq-item">
          <h4 className="lp-faq-question">How are health tips created?</h4>
          <p className="lp-faq-answer">Tips are generated using AI analysis and established health guidelines, ensuring advice is both personal and evidence-based.</p>
        </div>
      </div>
      <a href="#contact" className="lp-faq-contact-link">Get in touch <span className="lp-arrow-right">→</span></a>
    </section>
  );
};

export default FAQSection;