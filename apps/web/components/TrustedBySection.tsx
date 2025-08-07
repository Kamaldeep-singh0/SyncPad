import React from 'react'

const TrustedBySection = () => (
  <div className="bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-center text-sm font-medium text-gray-500 mb-8">
        TRUSTED BY TEAMS AT
      </p>
      <div className="flex justify-center items-center space-x-12 opacity-60">
        {['TechCorp', 'InnovateLabs', 'DigitalFlow', 'TeamSync', 'CodeBase'].map((company) => (
          <div key={company} className="text-gray-400 font-semibold text-lg">
            {company}
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default TrustedBySection
