import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleArticlesClick = () => {
    window.open('https://longenomics.substack.com/', '_blank');
  };

  const handleJoinNow = () => {
    navigate('/join');
  };

  return (
    <footer className="footer-container">
      <div className="footer-content-wrapper">
        <div className="footer-left-section">
          <div className="footer-logo-section">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⭐</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Longenomics</span>
            </Link>
          </div>
          <button className="join-now-button" onClick={handleJoinNow}>Join now</button>
        </div>

        <div className="footer-links-section">
          <div className="footer-column">
            <h3>Platform</h3>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><a href="#" onClick={() => scrollToSection('features')}>Insights</a></li>
              <li><a href="#" onClick={() => scrollToSection('plans')}>Plans</a></li>
              <li><Link to="/support">Help</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li><button onClick={handleArticlesClick} className="footer-link-button">Articles</button></li>
              <li><a href="#guides">Guides</a></li>
              <li><a href="#" onClick={() => scrollToSection('faqs')}>FAQs</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#partners">Partners</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#cookies">Cookies</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#compliance">Compliance</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><a href="#team">Team</a></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#news">News</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="social-icons">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
        </div>
        <div className="footer-horizontal-line"></div>
      </div>

      <div className="footer-copyright-section">
        <div className="footer-legal-links">
          <a href="#privacy-policy">Privacy</a>
          <a href="#terms-of-service">Terms</a>
          <a href="#cookies-policy">Cookies</a>
        </div>
        <div className="footer-copyright-text">
          All rights reserved © 2025 Longenomics
        </div>
      </div>
    </footer>
  );
};

export default Footer;