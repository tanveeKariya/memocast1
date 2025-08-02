import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Avery Lin',
      company: 'HealthSync',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'The health timeline gave me clear, actionable steps for prevention.'
    },
    {
      name: 'Jordan Ellis',
      company: 'WellFusion',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'Unified data from wearables and labs made my health progress easy to track.'
    },
    {
      name: 'Morgan Shaw',
      company: 'InsightVitals',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'AI insights helped me prioritize preventive care in my routine.'
    },
    {
      name: 'Taylor Reed',
      company: 'BioTrack',
      image: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'Digital twin features keep me focused on my wellness goals.'
    },
    {
      name: 'Casey Drew',
      company: 'OptiWell',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'I finally have a long-term, personalized health plan.'
    },
    {
      name: 'Riley Fox',
      company: 'PulseMetrics',
      image: 'https://images.pexels.com/photos/3763189/pexels-photo-3763189.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'Centralized health data streamlined my daily routine.'
    },
    {
      name: 'Skyler James',
      company: 'LifeSpanIQ',
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'Recommendations are clear, relevant, and easy to follow.'
    },
    {
      name: 'Emerson Blake',
      company: 'CoreVitals',
      image: 'https://images.pexels.com/photos/3785078/pexels-photo-3785078.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'Collaboration tools make sharing progress with my care team simple.'
    }
  ];

  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">USER STORIES</div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Personalized health, proven results
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            See how professionals use data-driven insights to improve their long-term health.
          </p>
        </div>
{/* 
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.company}</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{testimonial.quote}</p>
              <div className="text-sm text-gray-500 mt-3">{testimonial.company}</div>
            </div>
          ))}
        </div> */}

        <div className="text-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
            Join now
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;