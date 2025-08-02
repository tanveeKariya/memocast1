import React from 'react';

const PlatformSection = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Collaborative precision health engine */}
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop" 
                alt="Health dashboard interface" 
                className="rounded-2xl shadow-2xl mx-auto max-w-md w-full"
              />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Collaborative precision health engine
            </h3>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Unify research, data, and insights for predictive, personalized preventive care. Accelerate innovation with secure, integrated collaboration.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
              Discover
            </button>
          </div>

          {/* Motivational health, gamified */}
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop" 
                alt="Gamified health interface" 
                className="rounded-2xl shadow-2xl mx-auto max-w-md w-full"
              />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Motivational health, gamified
            </h3>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Drive healthy habits with tailored challenges, progress tracking, and rewards. Stay engaged and proactive on your wellness path.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
              Join now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;