import React from 'react';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'Free forever',
      description: 'Track basics with AI insights.',
      buttonText: 'Get started',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      features: [
        'Personal health dashboard',
        'Wearable sync',
        'AI health tips'
      ]
    },
    {
      name: 'Core',
      price: '$9',
      period: 'Per month',
      description: 'Deeper analytics and custom goals.',
      buttonText: 'Upgrade',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      features: [
        'All Starter features',
        'Lab data sync',
        'Custom milestones',
        'Priority support'
      ]
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'Per month',
      description: 'Full platform for teams & orgs.',
      buttonText: 'Contact',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      features: [
        'All Core features',
        'Team collaboration',
        'AI risk prediction',
        'Advanced reporting',
        'Account manager'
      ]
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="plans" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="mb-8">
                <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <div className="text-gray-600 mb-6">{plan.period}</div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <button className={`w-full py-3 px-6 rounded-lg transition-colors font-medium ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">INCLUDES</div>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default PricingSection;