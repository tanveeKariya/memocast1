import React from 'react';

const DashboardSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="relative">
            <img 
              src="https://cdn.prod.website-files.com/685392287f5df8eff390d613/685392f2eef67bc4547f2e4a_fcf26711-3eff-4ebd-a7bb-9fbef6554280.avif" 
              alt="Health dashboard on tablet" 
              className="rounded-2xl shadow-2xl max-w-4xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;