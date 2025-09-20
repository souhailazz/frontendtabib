import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import './i18n';
import { FaSearch, FaBolt, FaHospitalAlt, FaMobileAlt, FaHeartbeat, FaBone, FaBrain, FaBaby, FaEye, FaTooth, FaFacebook, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock, FaUserMd, FaCity, FaUserPlus, FaInfoCircle, FaSignInAlt, FaSignOutAlt, FaUserShield, FaRocket, FaHandsHelping, FaLock, FaFileMedical, FaGavel, FaBars, FaTimes, FaUser, FaChevronDown } from 'react-icons/fa';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Profiles from './components/Profiles/Profiles';
import HealthcareSearch from './components/Search/healthcare-search';
import ResponseSearch from './components/ResponseSearch/ResponseSearch';
import Signup from './components/Signup/Signup';
import LoginForm from './components/Login/Login';
import MyConsultation from './components/MyConsultation/MyConsultation';
import Dashboard from './components/Dashboard/Dashboard';
import Admin from './components/Admin/Admin';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
import ProtectedRoute from './components/ProtectedRoute';
import SessionStorageTest from './components/SessionStorageTest/SessionStorageTest';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsOfService from './components/Legal/TermsOfService';
import MedicalDisclaimer from './components/Legal/MedicalDisclaimer';
import { getOptimalImageSource } from './utils/imageUtils';
import heroBgWebP from './assets/healthcare-hero-bg.webp';
import heroBgPNG from './assets/healthcare-hero-bg.png';
import About from './components/About/About';
// Home component
const Home = () => {
  const { t } = useTranslation();
  const [bgImage, setBgImage] = useState('');
  
  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      try {
        // Simplified image loading without WebP detection for now
        // We'll use the imported images directly
        if (isMounted) {
          setBgImage(heroBgWebP); // Use WebP directly
        }
      } catch (error) {
        console.error('Error in image loading logic:', error);
        if (isMounted) setBgImage(heroBgPNG); // Fallback to PNG on error
      }
    };
    
    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return (
    <div className="home-container">
      <div 
        className="hero-section"
        style={{
          backgroundImage: bgImage 
            ? `linear-gradient(rgba(15, 76, 117, 0.3), rgba(15, 76, 117, 0.5)), url(${bgImage})`
            : 'linear-gradient(rgba(15, 76, 117, 0.3), rgba(15, 76, 117, 0.5))'
        }}
      >
        <div className="hero-content">
          <h1>{t('home.hero.title')}</h1>
          <p className="description">{t('home.hero.description')}</p>
          <div className="cta-buttons">
            <Link to="/search" className="primary-btn">{t('home.hero.findDoctors')}</Link>
            <Link to="/about" className="secondary-btn">{t('home.hero.learnMore')}</Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>{t('home.features.title')}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaSearch /></div>
            <h3>{t('home.features.easySearch.title')}</h3>
            <p>{t('home.features.easySearch.description')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaBolt /></div>
            <h3>{t('home.features.quickBooking.title')}</h3>
            <p>{t('home.features.quickBooking.description')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaHospitalAlt /></div>
            <h3>{t('home.features.verifiedDoctors.title')}</h3>
            <p>{t('home.features.verifiedDoctors.description')}</p>
          </div>
        </div>
      </div>

      <div className="specialties-section">
        <h2>{t('home.specialties.title')}</h2>
        <div className="specialties-grid">
          <div className="specialty-item">
            <span className="specialty-emoji"><FaHeartbeat /></span>
            <span>{t('home.specialties.cardiology')}</span>
          </div>
          <div className="specialty-item">
            <span className="specialty-emoji"><FaBone /></span>
            <span>{t('home.specialties.orthopedics')}</span>
          </div>
          <div className="specialty-item">
            <span className="specialty-emoji"><FaBrain /></span>
            <span>{t('home.specialties.neurology')}</span>
          </div>
          <div className="specialty-item">
            <span className="specialty-emoji"><FaBaby /></span>
            <span>{t('home.specialties.pediatrics')}</span>
          </div>
          <div className="specialty-item">
            <span className="specialty-emoji"><FaEye /></span>
            <span>{t('home.specialties.ophthalmology')}</span>
          </div>
          <div className="specialty-item">
            <span className="specialty-emoji"><FaTooth /></span>
            <span>{t('home.specialties.dentistry')}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>{t('home.stats.title')}</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">{t('home.stats.doctors')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">{t('home.stats.patients')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">12</div>
            <div className="stat-label">{t('home.stats.cities')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">{t('home.stats.support')}</div>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2>{t('home.testimonials.title')}</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>{t('home.testimonials.fatima')}</p>
            </div>
            <div className="testimonial-author">
              <strong>Fatima K.</strong>
              <span>Casablanca</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>{t('home.testimonials.ahmed')}</p>
            </div>
            <div className="testimonial-author">
              <strong>Ahmed M.</strong>
              <span>Marrakech</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>{t('home.testimonials.zineb')}</p>
            </div>
            <div className="testimonial-author">
              <strong>Zineb A.</strong>
              <span>Fez</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>{t('home.cta.title')}</h2>
        <p>{t('home.cta.description')}</p>
        <div className="cta-buttons">
          <Link to="/search" className="primary-btn">{t('home.cta.findDoctor')}</Link>
          <Link to="/Signup" className="secondary-btn">{t('home.cta.createAccount')}</Link>
        </div>
      </div>
    </div>
  );
};

// NotFound component
const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="not-found">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.description')}</p>
      <Link to="/" className="back-link">{t('notFound.backLink')}</Link>
    </div>
  );
};

// AppContent component that can use useLocation
const AppContent = () => {
  const { isLoggedIn, userType, userId, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false); // Add state for mobile nav
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Add state for profile dropdown

  const handleLogout = () => {
    logout();
    setNavOpen(false); // Close nav on logout
    setProfileDropdownOpen(false); // Close profile dropdown on logout
  };

  // Check if current path is admin page
  const isAdminPage = location.pathname === '/admin';

  // Close nav when route changes
  useEffect(() => {
    setNavOpen(false);
    setProfileDropdownOpen(false); // Also close profile dropdown on route change
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [profileDropdownOpen]);

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo-container">
          <Link to="/" className="logo-link">
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <source srcSet="/logo.svg" type="image/svg+xml" />
            <img 
              src="/logo.svg" 
              alt="Tabib.life logo" 
              className="logo"
            />
          </picture>
          </Link>
        </div>
        {/* Hamburger menu for mobile */}
        <button
          className="menu-toggle"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          onClick={() => setNavOpen(!navOpen)}
        >
          {navOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav className={`main-nav${navOpen ? " open" : ""}`}>
          <Link to="/" onClick={() => setNavOpen(false)}>{t('nav.home')}</Link>
          <Link to="/search" onClick={() => setNavOpen(false)}>{t('nav.findDoctors')}</Link>
          <Link to="/MyConsultation" onClick={() => setNavOpen(false)}>{t('nav.consultation')}</Link>
          {isLoggedIn && userType === "docteur" && (
            <Link to="/dashboard" onClick={() => setNavOpen(false)}>{t('nav.dashboard')}</Link>
          )}
          {isLoggedIn && userType === "patient" && userId === "1" && (
            <Link to="/admin" onClick={() => setNavOpen(false)}>Admin Panel</Link>
          )}
          <Link to="/about" onClick={() => setNavOpen(false)}>{t('nav.about')}</Link>
          <LanguageSwitcher />
          
          {/* Profile dropdown */}
          <div className="profile-dropdown">
            <button 
              className="profile-trigger"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              aria-label="Profile menu"
            >
              <FaUser />
              <FaChevronDown className={`dropdown-arrow ${profileDropdownOpen ? 'open' : ''}`} />
            </button>
            
            {profileDropdownOpen && (
              <div className="dropdown-menu">
                {!isLoggedIn ? (
                  <>
                    <Link to="/Login" onClick={() => { setNavOpen(false); setProfileDropdownOpen(false); }}>
                      <FaSignInAlt /> {t('nav.login')}
                    </Link>
                    <Link to="/Signup" onClick={() => { setNavOpen(false); setProfileDropdownOpen(false); }}>
                      <FaUserPlus /> {t('home.cta.createAccount')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/Profile" onClick={() => { setNavOpen(false); setProfileDropdownOpen(false); }}>
                      <FaUser /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-logout-button">
                      <FaSignOutAlt /> {t('nav.logout')}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<HealthcareSearch />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/response-search" element={<ResponseSearch />} />
          <Route path="/MyConsultation" element={
            <ProtectedRoute>
              <MyConsultation />
            </ProtectedRoute>
          } />
          <Route path="/Profile" element={
              <Profiles />
          } />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
          <Route path="/SessionStorageTest" element={<SessionStorageTest />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
          <Route path="/dashboard" element={
              <Dashboard />
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredUserTypeAndId={{ type: "patient", id: "1" }}>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Conditionally render footer - hide on admin page */}
      {!isAdminPage && (
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Tabib Healthcare</h3>
              <p>{t('footer.description')}</p>
              <div className="social-links">
                <span>{t('footer.followUs')} </span>
                <span> <FaFacebook /> </span>
                <a href="#" className="social-link">Facebook</a>
                <span> <FaInstagram /> </span>
                <a href="#" className="social-link">Instagram</a>
                <span> <FaLinkedin /> </span>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>{t('footer.quickLinks')}</h4>
              <div className="footer-links">
                <Link to="/search">{t('nav.findDoctors')}</Link>
                <Link to="/about">{t('nav.about')}</Link>
                <Link to="/MyConsultation">{t('nav.consultation')}</Link>
                <Link to="/Signup">{t('home.cta.createAccount')}</Link>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>{t('footer.popularCities')}</h4>
              <div className="footer-links">
                <a href="#">Casablanca</a>
                <a href="#">Rabat</a>
                <a href="#">Marrakech</a>
                <a href="#">Fez</a>
                <a href="#">Tangier</a>
                <a href="#">Agadir</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>{t('footer.contactInfo')}</h4>
              <div className="contact-info">
                <p><FaEnvelope /> admin@tabib.life</p>
                <p><FaPhone /> +212 563308663</p>
                <p><FaMapMarkerAlt /> Casablanca, Morocco</p>
                <p><FaClock /> 24/7 Support</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>{t('footer.copyright')}</p>
            <div className="footer-legal">
              <Link to="/privacy-policy"><FaLock /> {t('footer.privacyPolicy')}</Link>
              <Link to="/terms-of-service"><FaGavel /> {t('footer.termsOfService')}</Link>
              <Link to="/medical-disclaimer"><FaFileMedical /> {t('footer.medicalDisclaimer')}</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;