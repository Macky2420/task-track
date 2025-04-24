import React, {useState} from "react";
import background from "../assets/background.png";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";

const Hero = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

    return (
      <div className="min-h-screen">
        {/* Login Modal */}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
        />
         {/* Register Modal */}
        <RegisterModal 
          isOpen={showRegisterModal} 
          onClose={() => setShowRegisterModal(false)}
        />
        {/* Navigation */}
        <header className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl italic" 
              style={{ color: '#2f5d70' }}>  {/* Changed color and added italic */}
              TaskTrack
            </a>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <button 
                  className="btn btn-ghost"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </button>
              </li>
                <li>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowRegisterModal(true)}
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
        </header>

        {/* Hero Section with Background Image */}
        <div className="hero relative min-h-[calc(100vh-4rem)]">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="hero-content relative z-10 flex-col lg:flex-row-reverse gap-12 py-24 px-4 sm:px-8">
            {/* Text Content */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-white">
              <h1 className="text-5xl font-bold text-center lg:text-left">
                Organize Your Tasks,<br/>Track Your Progress
              </h1>
              <p className="py-6 text-center lg:text-left">
                Transform your productivity with TaskTrack - the intuitive PWA that helps you manage tasks, 
                track progress, and achieve your goals. Access anywhere, anytime!
              </p>
              <div className="flex gap-4">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowRegisterModal(true)}
                >
                  Get Started
                </button>
              </div>

              {/* Feature Badges */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="badge badge-outline p-4 text-white">🚀 Progress Tracking</div>
                <div className="badge badge-outline p-4 text-white">🔔 Reminders (Coming Soon)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Hero;