import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Star, FileText } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const navigate = useNavigate();

  // Helper to close all menus/dropdowns
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsPlatformOpen(false);
    setIsSupportOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
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
    closeAllMenus(); // Close all menus after scrolling
  };

  const handlePlatformClick = () => {
    console.log("Platform item clicked! Navigating to /dashboard");
    navigate('/dashboard');
    closeAllMenus(); // Close all menus after navigation
  };

  const handleSeeFeatures = () => {
    console.log("See Features clicked!");
    navigate('/dashboard');
    closeAllMenus();
  };

  const handleJoinNow = () => {
    console.log("Join Now clicked!");
    navigate('/join');
    closeAllMenus();
  };

  const handleArticlesClick = () => {
    console.log("Blog clicked!");
    window.open('https://longenomics.substack.com/', '_blank');
    closeAllMenus();
  };

  const handleSupportClick = () => {
    console.log("Help Center clicked!");
    navigate('/support');
    closeAllMenus();
  };

  const handleContactClick = () => {
    console.log("Contact clicked!");
    navigate('/contact');
    closeAllMenus();
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeAllMenus}>
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            {/* <span className="text-xl font-semibold text-gray-900">Longeconomics</span> */}
            <span className="text-xl font-bold text-gray-900">Longenomics</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 ml-12">
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer"
                onClick={() => setIsPlatformOpen(!isPlatformOpen)}
              >
                <span>Platform</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isPlatformOpen && (
                <div className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 z-50">
                  <div className="grid grid-cols-4 gap-8">
                    {/* Personalized Health Column */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">PERSONALIZED HEALTH</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Digital twin</h4>
                            <p className="text-sm text-gray-600">Monitor your health journey.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Health timeline</h4>
                            <p className="text-sm text-gray-600">See risks and milestones.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">AI insights</h4>
                            <p className="text-sm text-gray-600">Receive data-backed guidance.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Integrations Column */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">INTEGRATIONS</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Wearables</h4>
                            <p className="text-sm text-gray-600">Connect for live tracking.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Lab reports</h4>
                            <p className="text-sm text-gray-600">Analyze lab data easily.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Behavior signals</h4>
                            <p className="text-sm text-gray-600">Track daily habits.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations Column */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">RECOMMENDATIONS</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Medical tests</h4>
                            <p className="text-sm text-gray-600">Suggested screenings for you.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Diet plans</h4>
                            <p className="text-sm text-gray-600">Personalized nutrition advice.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Motivation</h4>
                            <p className="text-sm text-gray-600">Engage with gamified tools.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Column */}
                    <div className="bg-gray-900 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Advance preventive health research</h3>
                      <p className="text-sm text-gray-300 mb-4">Partner with experts in longevity science.</p>
                      <button
                        className="text-white hover:text-gray-200 flex items-center space-x-1"
                        onClick={handlePlatformClick}
                      >
                        <span>Demo</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-gray-900" onClick={closeAllMenus}>About</Link>
            <button onClick={handleArticlesClick} className="text-gray-700 hover:text-gray-900">Blog</button>

            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer"
                onClick={() => setIsSupportOpen(!isSupportOpen)}
              >
                <span>Support</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isSupportOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <button onClick={handleSupportClick} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Help Center</button>
                  <button onClick={handleContactClick} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Contact</button>
                </div>
              )}
            </div>
          </nav>

          {/* CTA Button and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={handleJoinNow}
            >
              Join
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden z-50" // Added z-index for the toggle button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 absolute w-full left-0 bg-white shadow-lg z-40"> {/* Adjusted z-index here */}
            <div className="flex flex-col space-y-4 px-4"> {/* Added px-4 for consistent padding */}
              {/* Platform Section */}
              <div>
                <div
                  className="flex items-center justify-between text-gray-700 cursor-pointer py-2"
                  onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                >
                  <span>Platform</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isPlatformOpen ? 'rotate-180' : ''}`} />
                </div>

                {isPlatformOpen && (
                  <div className="bg-gray-50 rounded-lg p-4 ml-4 mt-2">
                    <div className="space-y-6">
                      {/* Personalized Health Section */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">PERSONALIZED HEALTH</h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">Digital twin</h4>
                              <p className="text-sm text-gray-600">Monitor your health journey.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">Health timeline</h4>
                              <p className="text-sm text-gray-600">See risks and milestones.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">AI insights</h4>
                              <p className="text-sm text-gray-600">Receive data-backed guidance.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Integrations Section */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">INTEGRATIONS</h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">Wearables</h4>
                              <p className="text-sm text-gray-600">Connect for live tracking.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">Lab reports</h4>
                              <p className="text-sm text-gray-600">Analyze lab data easily.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">Behavior signals</h4>
                              <p className="text-sm text-gray-600">Track daily habits.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations Section */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">RECOMMENDATIONS</h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">Medical tests</h4>
                              <p className="text-sm text-gray-600">Suggested screenings for you.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">Diet plans</h4>
                              <p className="text-sm text-gray-600">Personalized nutrition advice.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 cursor-pointer" onClick={handlePlatformClick}>
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900">Motivation</h4>
                              <p className="text-sm text-gray-600">Engage with gamified tools.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Section for mobile */}
                      <div className="bg-gray-900 rounded-xl p-4 text-white">
                        <h3 className="text-base font-semibold mb-2">Advance preventive health research</h3>
                        <p className="text-sm text-gray-300 mb-3">Partner with experts in longevity science.</p>
                        <button
                          className="text-white hover:text-gray-200 flex items-center space-x-1 text-sm"
                          onClick={handlePlatformClick}
                        >
                          <span>Demo</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About Link in mobile menu */}
              <Link
                to="/about"
                className="text-gray-700 py-2"
                onClick={closeAllMenus}
              >
                About
              </Link>

              {/* Blog Link in mobile menu */}
              <button
                onClick={handleArticlesClick}
                className="text-gray-700 text-left py-2"
              >
                Blog
              </button>

              {/* Support Section in mobile menu */}
              <div>
                <div
                  className="flex items-center justify-between text-gray-700 cursor-pointer py-2"
                  onClick={() => setIsSupportOpen(!isSupportOpen)}
                >
                  <span>Support</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isSupportOpen ? 'rotate-180' : ''}`} />
                </div>

                {isSupportOpen && (
                  <div className="bg-gray-50 rounded-lg p-4 ml-4 mt-2 space-y-2">
                    <button
                      onClick={handleSupportClick}
                      className="block w-full text-left text-gray-700 hover:text-gray-900 py-1"
                    >
                      Help Center
                    </button>
                    <button
                      onClick={handleContactClick}
                      className="block w-full text-left text-gray-700 hover:text-gray-900 py-1"
                    >
                      Contact
                    </button>
                  </div>
                )}
              </div>

              {/* Careers Link in mobile menu */}
              <Link
                to="/careers"
                className="text-gray-700 py-2"
                onClick={closeAllMenus}
              >
                Careers
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Conditional Overlay for desktop dropdowns, and for mobile if sub-dropdowns are open */}
      {(isPlatformOpen || isSupportOpen) && !isMenuOpen && ( // Only show overlay for desktop dropdowns
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={closeAllMenus}
        />
      )}

      {/* New: Overlay for mobile sub-dropdowns only. Higher z-index than main menu, lower than dropdown content */}
      {isMenuOpen && (isPlatformOpen || isSupportOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-30" // Slightly lower opacity and z-index than main menu
          onClick={() => {
            setIsPlatformOpen(false); // Only close sub-dropdowns
            setIsSupportOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;