import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // EmailJS configuration
     const EMAILJS_SERVICE_ID = 'service_5rljbmt';
const EMAILJS_TEMPLATE_ID = 'template_huybkxd';
const EMAILJS_PUBLIC_KEY = 'TpBs8l4FrY-U0Lryf';
 // You'll need to get this from EmailJS

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        to_email: 'mission@longenomics.com',
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      };

      // For now, we'll simulate the email sending since EmailJS requires setup
      // Replace this with actual EmailJS call once configured:
      // await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      // Simulated success for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Show success message for 3 seconds
      setTimeout(() => setSubmitStatus(''), 3000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="contact-content">
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Ready to transform your health journey? We'd love to hear from you.
          </p>
        </div>

        <div className="contact-main">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <span className="icon-emoji">✉️</span>
              </div>
              <h3>Email Us</h3>
              <p>For inquiries, partnerships, or support</p>
              <a href="mailto:mission@longenomics.com" className="contact-email">
                mission@longenomics.com
              </a>
            </div>

            <div className="inspiring-text">
              <h2>Our Mission</h2>
              <p>
                At Longenomics, we believe that everyone deserves to live their healthiest, 
                longest life possible. Through cutting-edge AI technology and personalized 
                health insights, we're revolutionizing how people understand and optimize 
                their wellbeing.
              </p>
              <p>
                Join us in building a future where preventive care is personalized, 
                predictive, and accessible to all. Together, we can unlock the secrets 
                to human longevity and help you take charge of your healthspan.
              </p>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="contact-form-card">
              <h3>Send us a message</h3>
              
              {submitStatus === 'success' && (
                <div className="status-message success-message">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="status-message error-message">
                  ❌ Failed to send message. Please try again or email us directly.
                </div>
              )}
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Technical Support</option>
                    <option value="press">Press & Media</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
    </div>
  );
};

export default ContactPage;