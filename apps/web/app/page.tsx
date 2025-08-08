import React from 'react';
import NavBar from '../components/ui/NavBar';
import TrustedBySection from '../components/TrustedBySection';
import Cta from '../components/ui/Cta';
import Features from '../components/ui/Features';
import Preview from '../components/ui/Preview';
import HeroSection from '../components/ui/HeroSection';


const ProfessionalLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <HeroSection/>
          <Preview/>
        </div>
      </div>
      
      <TrustedBySection />
       <Features/>
      <Cta/>
    </div>
  );
};

export default ProfessionalLandingPage;