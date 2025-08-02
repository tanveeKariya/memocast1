import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSection from './DashboardSection';
import FeaturesSection from './FeaturesSection';
import PlatformSection from './PlatformSection';
import PricingSection from './PricingSection';
import HealthspanSection from './HealthspanSection';
import TeamSection from './TeamSection';
import ContactExperts from './ContactExperts';
import FAQSection from './FAQSection';
import HealthIntelligence from './HealthIntelligence';
import Footer from './Footer';  
import UserStories from './UserStories';
// import './HeroSection.css'; // Uncomment if you have specific styles for this section

import Header from './Header'; // Ensure this is the correct path to your Header component

const HeroSection = () => {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    navigate('/join');
  };

  const handleSeeFeatures = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <Header />
    <section className="bg-gray-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight font-bold">
          Your Gamified Digital<br />
          Twin for Better Health
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
          Unified health data. Predictive insights. Personalized longevity guidance for your future.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            onClick={handleJoinNow}
          >
            Join now
          </button>
          <button 
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            onClick={handleSeeFeatures}
          >
            See Our Demo
          </button>
        </div>
      </div>
    
       <DashboardSection />
      <FeaturesSection />
      <PlatformSection />
      <PricingSection />
      <HealthspanSection />
      <UserStories />
      <FAQSection />
      <HealthIntelligence />
      <ContactExperts />
      <TeamSection />
      <Footer />
    </section>
    </>
   
  );
};

export default HeroSection;