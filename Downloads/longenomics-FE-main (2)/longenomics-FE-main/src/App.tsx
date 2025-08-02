
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';

import ComingSoon from './components/ComingSoon';
import ContactPage from './components/ContactPage';
import Dashboard from './components/Dashboard'; 
function HomePage() {
  return (
    <>
      <HeroSection />
      
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white">
     {/* <Header /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
       <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<ComingSoon title="About" />} />
        <Route path="/careers" element={<ComingSoon title="Careers" />} />
        <Route path="/support" element={<ComingSoon title="Support" />} />
        <Route path="/join" element={<ComingSoon title="Join Now" />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      
    </div>
  );
}

export default App;