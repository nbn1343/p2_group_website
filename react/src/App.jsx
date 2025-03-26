import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './design/App.css'
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Home from './components/Home.jsx';

// Mock data for demonstration
const upcomingEvents = [
  { id: 1, title: "Youth Bible Study", date: "2025-03-20", type: "youth" },
  { id: 2, title: "Parent Committee", date: "2025-03-21", type: "parent" },
  { id: 3, title: "Senior Luncheon", date: "2025-03-22", type: "senior" },
  { id: 4, title: "Sunday Service", date: "2025-03-23", type: "all" },
  { id: 5, title: "Youth Choir", date: "2025-03-24", type: "youth" },
]

const testimonials = [
  { 
    id: 1, 
    text: "Since our church started using this platform, our youth attendance has increased by 40%. The text reminders are a game-changer!", 
    author: "Pastor Michael Johnson", 
    role: "Youth Pastor" 
  },
  { 
    id: 2, 
    text: "As a busy mom of three, I love getting all church communications in one place. The parent dashboard helps me keep track of my kids' activities.", 
    author: "Sarah Williams", 
    role: "Parent" 
  },
  { 
    id: 3, 
    text: "I'm not tech-savvy, but even I can use this system! The large text option and voice messages make it easy for seniors like me to stay connected.", 
    author: "Eleanor Thompson", 
    role: "Senior Member" 
  },
]

function App() {
  const [accessibilityMode, setAccessibilityMode] = useState({
    highContrast: false,
    largeText: false
  });
  
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleHighContrast = () => {
    setAccessibilityMode({
      ...accessibilityMode,
      highContrast: !accessibilityMode.highContrast
    });
  };

  const toggleLargeText = () => {
    setAccessibilityMode({
      ...accessibilityMode,
      largeText: !accessibilityMode.largeText
    });
  };
  
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };
  
  const closeAuthModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };
  
  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };
  
  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };
  
  const handleLogin = (userData) => {
    setUserData(userData);
    setIsAuthenticated(true);
    closeAuthModals();
    navigate('/home');
  };
  
  const handleRegister = (userData) => {
    setUserData(userData);
    setIsAuthenticated(true);
    closeAuthModals();
    navigate('/home');
  };
  
  const handleLogout = () => {
    setUserData(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className={`${accessibilityMode.highContrast ? 'high-contrast' : ''} ${accessibilityMode.largeText ? 'large-text' : ''}`}>
      <header>
        <div className="app-container header-content">
          <div className="logo">
            <img src="/src/assets/Logo.png" alt="Faith Connect Logo" />
          </div>
          
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/demo">Demo</Link>
            <Link to="/testimonials">Testimonials</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          
          <div className="auth-controls">
            {isAuthenticated ? (
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            ) : (
              <>
                <button className="login-btn" onClick={openLogin}>Log In</button>
                <button className="signup-btn" onClick={openRegister}>Sign Up</button>
              </>
            )}
          </div>
          
          <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <button className="mobile-menu-close" onClick={toggleMenu}>×</button>
            <nav className="mobile-nav-links">
              <Link to="/" onClick={toggleMenu}>Home</Link>
              <Link to="/features" onClick={toggleMenu}>Features</Link>
              <Link to="/demo" onClick={toggleMenu}>Demo</Link>
              <Link to="/testimonials" onClick={toggleMenu}>Testimonials</Link>
              <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            </nav>
            <div className="mobile-auth-controls">
              {isAuthenticated ? (
                <button className="logout-btn" onClick={() => {toggleMenu(); handleLogout();}}>Log Out</button>
              ) : (
                <>
                  <button className="login-btn" onClick={() => {toggleMenu(); openLogin();}}>Log In</button>
                  <button className="signup-btn" onClick={() => {toggleMenu(); openRegister();}}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {showLogin && <Login onClose={closeAuthModals} onSwitchToRegister={switchToRegister} onLogin={handleLogin} />}
      {showRegister && <Register onClose={closeAuthModals} onSwitchToLogin={switchToLogin} onRegister={handleRegister} />}
      
      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
            <Home userData={userData} />
          ) : (
            <LandingPage 
              upcomingEvents={upcomingEvents}
              testimonials={testimonials}
            />
          )
        } />
        <Route path="/features" element={<Features />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/testimonials" element={<Testimonials testimonials={testimonials} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/home" element={<Home userData={userData} />} />
      </Routes>
      
      <footer>
        <div className="app-container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>Faith Connect</h3>
              <p>Bridging the communication gap in religious communities across generations.</p>
            </div>
            
            <div className="footer-column">
              <h3>Features</h3>
              <div className="footer-links">
                <Link to="/features#smart-messaging">Smart Messaging</Link>
                <Link to="/features#unified-calendar">Unified Calendar</Link>
                <Link to="/features#parent-dashboard">Parent Dashboard</Link>
                <Link to="/features#accessibility-tools">Accessibility Tools</Link>
              </div>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <div className="footer-links">
                <a href="#">Blog</a>
                <a href="#">Support Center</a>
                <a href="#">Implementation Guide</a>
                <a href="#">API Documentation</a>
              </div>
            </div>
            
            <div className="footer-column">
              <h3>Contact</h3>
              <div className="footer-links">
                <a href="mailto:info@faithconnect.com">info@faithconnect.com</a>
                <a href="tel:+18005551234">1-800-555-1234</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Faith Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingPage({ upcomingEvents, testimonials }) {
  return (
    <main>
      <section className="hero">
        <div className="app-container">
          <h2>Connecting Generations Through Better Communication</h2>
          <p>
            Our platform bridges the gap between youth, parents, and seniors in your congregation
            with personalized messaging, unified calendars, and age-appropriate interfaces.
          </p>
          <div className="hero-buttons">
            <button className="btn-large">Request Demo</button>
            <button className="btn-large btn-secondary">Learn More</button>
          </div>
        </div>
      </section>
      
      <section id="features" className="features-section">
        <div className="app-container">
          <h2 className="text-center">Designed for Every Generation</h2>
          <div className="features">
            <div className="feature-card youth">
              <div className="feature-icon">📱</div>
              <h3>Youth Engagement</h3>
              <p>
                Concise text reminders, emoji-rich content, and direct response options 
                keep youth connected and engaged with church activities.
              </p>
            </div>
            
            <div className="feature-card parent">
              <div className="feature-icon">👪</div>
              <h3>Parent Dashboard</h3>
              <p>
                Comprehensive family view with appropriate oversight of children's activities,
                assignments and event details all in one place.
              </p>
            </div>
            
            <div className="feature-card senior">
              <div className="feature-icon">👵</div>
              <h3>Senior-Friendly Interface</h3>
              <p>
                Large text options, voice-to-text capabilities, and simplified navigation
                ensure seniors stay connected without technology barriers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="demo" className="demo-section">
        <div className="app-container">
          <h2 className="text-center section-title">Experience Our Dashboard</h2>
          <div className="demo-dashboard">
            <div className="demo-widget events-widget">
              <div className="widget-header">
                <h3>Upcoming Events</h3>
                <button className="widget-action-btn">+ Add</button>
              </div>
              <div className="widget-content">
                <ul className="events-list">
                  {upcomingEvents.slice(0, 3).map(event => (
                    <li key={event.id} className="event-item">
                      <div className="event-date">
                        <span className="event-day">{new Date(event.date).getDate()}</span>
                        <span className="event-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="event-details">
                        <h3>{event.title}</h3>
                        <p>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button className="view-all-btn">View All Events</button>
              </div>
            </div>

            <div className="demo-widget calendar-widget">
              <div className="widget-header">
                <h3>Calendar</h3>
                <div className="calendar-navigation">
                  <button>◀</button>
                  <h3>March 2025</h3>
                  <button>▶</button>
                </div>
              </div>
              <div className="widget-content">
                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                  ))}
                  
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const hasEvent = upcomingEvents.some(event => new Date(event.date).getDate() === day);
                    return (
                      <div key={day} className={`calendar-day ${hasEvent ? 'has-event' : ''}`}>
                        {day}
                        {hasEvent && <div className="event-indicator"></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <div className="app-container">
          <h2 className="text-center">What Churches Are Saying</h2>
          <div className="testimonial-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author-role">
                {testimonial.author} - <span className="testimonial-role">{testimonial.role}</span>
              </p>
            </div>
          ))}
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="app-container">
          <h2>Ready to Connect Your Congregation?</h2>
          <p>
            Join hundreds of churches that have improved attendance, engagement, and community
            through our cross-generational communication platform.
          </p>
          <button className="btn-large btn-secondary">Schedule a Free Demo</button>
        </div>
      </section>
    </main>
  );
}

function Features() {
  return (
    <section id="features" className="features-section">
      <div className="app-container">
        <h2 className="text-center">Our Features</h2>
        <div className="features-grid">
          <div id="smart-messaging" className="feature-item">
            <h3>Smart Messaging</h3>
            <p>Personalized communication tailored to each age group's preferences.</p>
          </div>
          <div id="unified-calendar" className="feature-item">
            <h3>Unified Calendar</h3>
            <p>A comprehensive church calendar with age-appropriate views and color-coding.</p>
          </div>
          <div id="parent-dashboard" className="feature-item">
            <h3>Parent Dashboard</h3>
            <p>Centralized hub for parents to manage their children's church activities.</p>
          </div>
          <div id="accessibility-tools" className="feature-item">
            <h3>Accessibility Tools</h3>
            <p>Features like large text and high contrast modes to accommodate all users.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section id="demo" className="demo-section">
      <div className="app-container">
        <h2 className="text-center">See Faith Connect in Action</h2>
        <div className="demo-video">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
        </div>
        <button className="btn-large">Request a Live Demo</button>
      </div>
    </section>
  );
}

function Testimonials({ testimonials }) {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="app-container">
        <h2 className="text-center">What Churches Are Saying</h2>
        <div className="testimonial-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author-role">
                {testimonial.author} - <span className="testimonial-role">{testimonial.role}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="app-container">
        <h2 className="text-center">Get in Touch</h2>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" className="btn-large">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default App;
