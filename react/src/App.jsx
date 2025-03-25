import { useState } from 'react'
import './App.css'
import Login from './Login';
import Register from './Register';

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
  })
  
  // Add state for auth modals
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const toggleHighContrast = () => {
    setAccessibilityMode({
      ...accessibilityMode,
      highContrast: !accessibilityMode.highContrast
    })
  }

  const toggleLargeText = () => {
    setAccessibilityMode({
      ...accessibilityMode,
      largeText: !accessibilityMode.largeText
    })
  }
  
  // Auth modal handlers
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

  // Generate calendar days for demo
  const calendarDays = Array.from({ length: 28 }, (_, i) => i + 1)
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <div className={`${accessibilityMode.highContrast ? 'high-contrast' : ''} ${accessibilityMode.largeText ? 'large-text' : ''}`}>
      <header>
        <div className="app-container header-content">
          <div className="logo">
            <img src="/church-icon.svg" alt="Faith Connect Logo" />
            <h1>Faith Connect</h1>
          </div>
          
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
          </nav>
          
          <div className="auth-controls">
            <button className="login-btn" onClick={openLogin}>Log In</button>
            <button className="signup-btn" onClick={openRegister}>Sign Up</button>
          </div>
          
          <div className="accessibility-controls">
            {/* <button 
              onClick={toggleHighContrast}
              aria-label="Toggle high contrast mode"
              title="Toggle high contrast mode"
            >
              {accessibilityMode.highContrast ? 'Standard Contrast' : 'High Contrast'}
            </button>
            <button 
              onClick={toggleLargeText}
              aria-label="Toggle large text mode"
              title="Toggle large text mode"
            >
              {accessibilityMode.largeText ? 'Standard Text' : 'Large Text'}
            </button> */}
          </div>
          
          <button className="mobile-menu-button" aria-label="Open menu">
            ☰
          </button>
        </div>
      </header>
      
      {/* Auth Modals */}
      {showLogin && <Login onClose={closeAuthModals} onSwitchToRegister={switchToRegister} />}
      {showRegister && <Register onClose={closeAuthModals} onSwitchToLogin={switchToLogin} />}
      
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
        
        <div className="app-container">
          <section id="features" className="features-section">
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
            
            <div className="features">
              <div className="feature-card">
                <div className="feature-icon">📆</div>
                <h3>Unified Calendar</h3>
                <p>
                  A comprehensive church calendar with age-appropriate views and
                  color-coding for different ministries and age groups.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Smart SMS System</h3>
                <p>
                  Customized text message reminders with intelligent timing
                  parameters tailored to event type and demographic.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Engagement Analytics</h3>
                <p>
                  Actionable insights into communication effectiveness across
                  demographic groups to refine your outreach strategy.
                </p>
              </div>
            </div>
          </section>
          
          <section id="demo" className="demo-section">
            <h2 className="text-center section-title">See How It Works</h2>
            <div className="demo-content">
              <div className="demo-messages">
                <h3 className="section-title">Smart Messaging System</h3>
                <div className="message youth">
                  <strong>Youth Message:</strong> Hey Jordan! 🙌 Don't forget Youth Bible Study tomorrow @ 6PM. Reply YES if you're coming! Need a ride? Reply RIDE
                </div>
                <div className="message parent">
                  <strong>Parent Message:</strong> Hello Mrs. Smith, This is a reminder that the Parent Committee meeting is scheduled for tomorrow, March 21st at 7:00 PM in the Fellowship Hall. Childcare will be provided. Please reply with the number of children attending.
                </div>
                <div className="message senior">
                  <strong>Senior Message:</strong> Senior Luncheon tomorrow at 12:00 PM. Transportation available. Reply NEED RIDE if you require transportation. [Voice message available]
                </div>
              </div>
              
              <div className="calendar-preview">
                <h3>Multi-Generational Calendar</h3>
                <div className="calendar-header">
                  <button>◀ Previous</button>
                  <h4>March 2025</h4>
                  <button>Next ▶</button>
                </div>
                <div className="calendar-grid">
                  {weekdays.map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                  ))}
                  
                  {calendarDays.map(day => (
                    <div key={day} className="calendar-day">
                      <div>{day}</div>
                      {upcomingEvents.find(event => new Date(event.date).getDate() === day) && (
                        <div className={`calendar-event event-${upcomingEvents.find(event => new Date(event.date).getDate() === day).type}`}>
                          {upcomingEvents.find(event => new Date(event.date).getDate() === day).title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          <section id="testimonials" className="testimonials">
            <h2 className="text-center">What Churches Are Saying</h2>
            <div className="testimonial-grid">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="testimonial-card">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <p className="testimonial-author">{testimonial.author}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="cta-section">
            <h2>Ready to Connect Your Congregation?</h2>
            <p>
              Join hundreds of churches that have improved attendance, engagement, and community
              through our cross-generational communication platform.
            </p>
            <button className="btn-large btn-secondary">Schedule a Free Demo</button>
          </section>
          
          <section id="contact" className="contact-section">
            <h2>Have Questions?</h2>
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
                <label htmlFor="church">Church Name</label>
                <input type="text" id="church" name="church" />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              
              <button type="submit" className="send-message-btn">Send Message</button>
            </form>
          </section>
        </div>
      </main>
      
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
                <a href="#features">Smart Messaging</a>
                <a href="#features">Unified Calendar</a>
                <a href="#features">Parent Dashboard</a>
                <a href="#features">Accessibility Tools</a>
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
  )
}

export default App
