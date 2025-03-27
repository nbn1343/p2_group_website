import { useState } from "react";
import "./design/App.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const upcomingEvents = [
	{ id: 1, title: "Youth Bible Study", date: "2025-03-20", type: "youth" },
	{ id: 2, title: "Parent Committee", date: "2025-03-21", type: "parent" },
	{ id: 3, title: "Senior Luncheon", date: "2025-03-22", type: "senior" },
	{ id: 4, title: "Sunday Service", date: "2025-03-23", type: "all" },
	{ id: 5, title: "Youth Choir", date: "2025-03-24", type: "youth" },
];

const testimonials = [
	{
		id: 1,
		text: "Since our church started using this platform, our youth attendance has increased by 40%. The text reminders are a game-changer!",
		author: "Pastor Michael Johnson",
		role: "Youth Pastor",
	},
	{
		id: 2,
		text: "As a busy mom of three, I love getting all church communications in one place. The parent dashboard helps me keep track of my kids' activities.",
		author: "Sarah Williams",
		role: "Parent",
	},
	{
		id: 3,
		text: "I'm not tech-savvy, but even I can use this system! The large text option and voice messages make it easy for seniors like me to stay connected.",
		author: "Eleanor Thompson",
		role: "Senior Member",
	},
];

function App() {
	const [accessibilityMode, setAccessibilityMode] = useState({
		highContrast: false,
		largeText: false,
	});

  const navigate = useNavigate(); // Initialize navigation

	// Add state for auth modals and user authentication
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userData, setUserData] = useState(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const toggleHighContrast = () => {
		setAccessibilityMode({
			...accessibilityMode,
			highContrast: !accessibilityMode.highContrast,
		});
	};

	const toggleLargeText = () => {
		setAccessibilityMode({
			...accessibilityMode,
			largeText: !accessibilityMode.largeText,
		});
	};

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

	// Authentication handlers
	const handleLogin = (userData) => {
		setUserData(userData);
		setIsAuthenticated(true);
		closeAuthModals();
	};

	const handleRegister = (userData) => {
		setUserData(userData);
		setIsAuthenticated(true);
		closeAuthModals();
	};


	const handleLogout = () => {
		setUserData(null);
		setIsAuthenticated(false);
    console.log("Log out successful.")
    navigate("/"); // Navigate to the landing page after logout
	};

	// If user is authenticated, show the main dashboard
	if (isAuthenticated) {
		return <Home userData={userData} onLogout={handleLogout} />;
	}

	// Otherwise show the landing page with login/register functionality
	return (
		<div
			className={`${accessibilityMode.highContrast ? "high-contrast" : ""} ${
				accessibilityMode.largeText ? "large-text" : ""
			}`}
		>
			<header>
				<div className="app-container header-content">
					<div className="logo">
						<img src="/src/assets/Logo.png" alt="Faith Connect Logo" />
					</div>

					<nav className="nav-links">
						<a href="#features">Features</a>
						<a href="#demo">Demo</a>
						<a href="#testimonials">Testimonials</a>
						<a href="#contact">Contact</a>
					</nav>

					<div className="auth-controls">
						<button className="login-btn" onClick={openLogin}>
							Log In
						</button>
						<button className="signup-btn" onClick={openRegister}>
							Sign Up
						</button>
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

					<button
						className="mobile-menu-button"
						onClick={toggleMenu}
						aria-label="Toggle menu"
					>
						☰
					</button>
				</div>
			</header>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="mobile-menu-overlay">
					<div className="mobile-menu">
						<button className="mobile-menu-close" onClick={toggleMenu}>
							×
						</button>
						<nav className="mobile-nav-links">
							<a href="#features" onClick={toggleMenu}>
								Features
							</a>
							<a href="#demo" onClick={toggleMenu}>
								Demo
							</a>
							<a href="#testimonials" onClick={toggleMenu}>
								Testimonials
							</a>
							<a href="#contact" onClick={toggleMenu}>
								Contact
							</a>
						</nav>
						<div className="mobile-auth-controls">
							<button
								className="login-btn"
								onClick={() => {
									toggleMenu();
									openLogin();
								}}
							>
								Log In
							</button>
							<button
								className="signup-btn"
								onClick={() => {
									toggleMenu();
									openRegister();
								}}
							>
								Sign Up
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Auth Modals */}
			{showLogin && (
				<Login
					onClose={closeAuthModals}
					onSwitchToRegister={switchToRegister}
					onLogin={handleLogin}
				/>
			)}
			{showRegister && (
				<Register
					onClose={closeAuthModals}
					onSwitchToLogin={switchToLogin}
					onRegister={handleRegister}
				/>
			)}

			<main>
				<section className="hero">
					<div className="app-container">
						<h2>Unite in Every Message</h2>
						<p>
							Bridging the gap between youth, parents, and seniors
							in your congregation with personalized messaging via SMS, unified
							calendars, and age-appropriate interfaces.
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
									Concise text reminders, emoji-rich content, and direct
									response options keep youth connected and engaged with church
									activities.
								</p>
							</div>

							<div className="feature-card parent">
								<div className="feature-icon">👪</div>
								<h3>Parent Dashboard</h3>
								<p>
									Comprehensive family view with appropriate oversight of
									children's activities, assignments and event details all in
									one place.
								</p>
							</div>

							<div className="feature-card senior">
								<div className="feature-icon">👵</div>
								<h3>Senior-Friendly Interface</h3>
								<p>
									Large text options, voice-to-text capabilities, and simplified
									navigation ensure seniors stay connected without technology
									barriers.
								</p>
							</div>
						</div>

						<div className="features">
							<div className="feature-card youth">
								<div className="feature-icon">📆</div>
								<h3>Unified Calendar</h3>
								<p>
									A comprehensive church calendar with age-appropriate views and
									color-coding for different ministries and age groups.
								</p>
							</div>

							<div className="feature-card parent">
								<div className="feature-icon">💬</div>
								<h3>Smart SMS System</h3>
								<p>
									Customized text message reminders with intelligent timing
									parameters tailored to event type and demographic.
								</p>
							</div>

							<div className="feature-card senior">
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
						<h2 className="text-center section-title">
							Experience Our Dashboard
						</h2>
						<div className="demo-dashboard">
							{/* Events Widget */}
							<div className="demo-widget events-widget">
								<div className="widget-header">
									<h3>Upcoming Events</h3>
									<button className="widget-action-btn">+ Add</button>
								</div>
								<div className="widget-content">
									<ul className="events-list">
										<li className="event-item">
											<div className="event-date">
												<span className="event-day">26</span>
												<span className="event-month">Mar</span>
											</div>
											<div className="event-details">
												<h3>Youth Bible Study</h3>
												<p>6:00 PM • Youth Room</p>
											</div>
										</li>
										<li className="event-item">
											<div className="event-date">
												<span className="event-day">28</span>
												<span className="event-month">Mar</span>
											</div>
											<div className="event-details">
												<h3>Parent Committee</h3>
												<p>7:00 PM • Fellowship Hall</p>
											</div>
										</li>
										<li className="event-item">
											<div className="event-date">
												<span className="event-day">30</span>
												<span className="event-month">Mar</span>
											</div>
											<div className="event-details">
												<h3>Sunday Service</h3>
												<p>10:00 AM • Main Sanctuary</p>
											</div>
										</li>
									</ul>
									<button className="view-all-btn">View All Events</button>
								</div>
							</div>

							{/* Calendar Widget */}
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
										{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
											(day) => (
												<div key={day} className="calendar-day-header">
													{day}
												</div>
											)
										)}

										{Array.from({ length: 31 }, (_, i) => {
											const day = i + 1;
											const hasEvent = [26, 28, 30].includes(day);
											return (
												<div
													key={day}
													className={`calendar-day ${
														hasEvent ? "has-event" : ""
													}`}
												>
													{day}
													{hasEvent && <div className="event-indicator"></div>}
												</div>
											);
										})}
									</div>
								</div>
							</div>

							{/* Groups Widget */}
							<div className="demo-widget groups-widget">
								<div className="widget-header">
									<h3>Groups</h3>
									<button className="widget-action-btn">+ Join</button>
								</div>
								<div className="widget-content">
									<ul className="groups-list">
										<li className="group-item">
											<div className="group-icon">Y</div>
											<div className="group-details">
												<h3>Youth Ministry</h3>
												<p>
													24 members •{" "}
													<span className="role-badge">Member</span>
												</p>
											</div>
										</li>
										<li className="group-item">
											<div className="group-icon">W</div>
											<div className="group-details">
												<h3>Worship Team</h3>
												<p>
													12 members •{" "}
													<span className="role-badge">Leader</span>
												</p>
											</div>
										</li>
										<li className="group-item">
											<div className="group-icon">B</div>
											<div className="group-details">
												<h3>Bible Study</h3>
												<p>
													18 members •{" "}
													<span className="role-badge">Member</span>
												</p>
											</div>
										</li>
									</ul>
									<button className="view-all-btn">View All Groups</button>
								</div>
							</div>

							{/* Reminders Widget */}
							<div className="demo-widget reminders-widget">
								<div className="widget-header">
									<h3>Reminders</h3>
									<button className="widget-action-btn">+ Add</button>
								</div>
								<div className="widget-content">
									<ul className="reminders-list">
										<li className="reminder-item priority-high">
											<input type="checkbox" id="reminder-1" />
											<div className="reminder-details">
												<label htmlFor="reminder-1">
													Prepare worship slides
												</label>
												<p>Due: March 26, 2025</p>
											</div>
										</li>
										<li className="reminder-item priority-medium">
											<input type="checkbox" id="reminder-2" />
											<div className="reminder-details">
												<label htmlFor="reminder-2">
													Bring snacks for youth group
												</label>
												<p>Due: March 26, 2025</p>
											</div>
										</li>
										<li className="reminder-item priority-medium">
											<input type="checkbox" id="reminder-3" />
											<div className="reminder-details">
												<label htmlFor="reminder-3">Call new members</label>
												<p>Due: March 29, 2025</p>
											</div>
										</li>
									</ul>
									<button className="view-all-btn">View All Reminders</button>
								</div>
							</div>

							{/* Chat Icon */}
							<div className="demo-chat-icon">
								<img
									src="/src/assets/message-icon.png"
									alt="Messages"
									className="chat-icon-image"
								/>
							</div>
						</div>
					</section>

					<section id="testimonials" className="testimonials">
						<h2 className="text-center">What Churches Are Saying</h2>
						<div className="testimonial-grid">
							{testimonials.map((testimonial) => (
								<div key={testimonial.id} className="testimonial-card">
									<p className="testimonial-text">"{testimonial.text}"</p>
									<p className="testimonial-author-role">
										{testimonial.author} -{" "}
										<span className="testimonial-role">{testimonial.role}</span>
									</p>
								</div>
							))}
						</div>
					</section>

					<section className="cta-section">
						<h2>Ready to Connect Your Congregation?</h2>
						<p>
							Join hundreds of churches that have improved attendance,
							engagement, and community through our cross-generational
							communication platform.
						</p>
						<button className="btn-large btn-secondary">
							Schedule a Free Demo
						</button>
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
								<textarea
									id="message"
									name="message"
									rows="5"
									required
								></textarea>
							</div>

							<button type="submit" className="send-message-btn">
								Send Message
							</button>
						</form>
					</section>
				</div>
			</main>

			<footer>
				<div className="app-container">
					<div className="footer-content">
						<div className="footer-column">
							<h3>Faith Connect</h3>
							<p>
								Bridging the communication gap in religious communities across
								generations.
							</p>
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
	);
}

export default App;
