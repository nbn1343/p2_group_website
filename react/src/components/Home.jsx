// Home.jsx
import { useState, useEffect } from "react";
import "../design/Home.css";
import Reminders from "./Reminders";

function Home({ userData, onLogout }) {
	// Use the userData prop to set the first name directly
	const firstName = userData?.user_metadata?.first_name || "User";

	// Reminder
	const [showAddReminderForm, setShowAddReminderForm] = useState(false);

	// Mock data for events
	const [events, setEvents] = useState([
		{
			id: 1,
			title: "Youth Bible Study",
			date: "2025-03-26",
			time: "6:00 PM",
			location: "Youth Room",
		},
		{
			id: 2,
			title: "Parent Committee",
			date: "2025-03-28",
			time: "7:00 PM",
			location: "Fellowship Hall",
		},
		{
			id: 3,
			title: "Sunday Service",
			date: "2025-03-30",
			time: "10:00 AM",
			location: "Main Sanctuary",
		},
	]);

	// Mock data for groups
	const [groups, setGroups] = useState([
		{ id: 1, name: "Youth Ministry", members: 24, role: "Member" },
		{ id: 2, name: "Worship Team", members: 12, role: "Leader" },
		{ id: 3, name: "Bible Study", members: 18, role: "Member" },
		{ id: 4, name: "Outreach Committee", members: 8, role: "Member" },
	]);

	// Calendar data
	const [currentDate, setCurrentDate] = useState(new Date());
	const [calendarDays, setCalendarDays] = useState([]);
	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	// Calendar view state – default to "calendar"
	const [calendarView, setCalendarView] = useState("calendar");

	// Chat state
	const [isChatOpen, setIsChatOpen] = useState(false);

	// Generate calendar days
	useEffect(() => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();

		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);

		const daysInMonth = lastDayOfMonth.getDate();
		const firstDayIndex = firstDayOfMonth.getDay();

		const days = [];

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < firstDayIndex; i++) {
			days.push({ day: "", empty: true });
		}

		// Add days of the month with event check
		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Date(year, month, i);
			const dateString = date.toISOString().split("T")[0];
			const hasEvent = events.some((event) => event.date === dateString);

			days.push({
				day: i,
				date: dateString,
				hasEvent,
				empty: false,
			});
		}

		setCalendarDays(days);
	}, [currentDate, events]);

	// Filter events to match the currently selected month and year
	const filteredEvents = events.filter((event) => {
		const eventDate = new Date(event.date);
		return (
			eventDate.getMonth() === currentDate.getMonth() &&
			eventDate.getFullYear() === currentDate.getFullYear()
		);
	});

	// Navigation for calendar
	const prevMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
		);
	};

	const nextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
		);
	};

	return (
		<div className="main-dashboard">
			<header className="dashboard-header">
				<div className="logo">
					<img src="/src/assets/Logo.png" alt="Faith Connect Logo" />
					<h1>Faith Connect</h1>
				</div>
				<div className="user-controls">
					<span className="username">Welcome, {firstName}</span>
					<button className="logout-btn" onClick={onLogout}>
						Log Out
					</button>
				</div>
			</header>

			<div className="widgets-container">
				{/* Calendar Widget - Left */}
				<div className="widget calendar-widget">
					<div className="widget-header">
						<h2>Calendar</h2>
						<div className="calendar-navigation">
							<button onClick={prevMonth}>◀</button>
							<h3>
								{currentDate.toLocaleString("default", {
									month: "long",
									year: "numeric",
								})}
							</h3>
							<button onClick={nextMonth}>▶</button>
						</div>
						<div className="calendar-view-toggle">
							<button
								className={`view-toggle-btn ${
									calendarView === "events" ? "active" : ""
								}`}
								onClick={() => setCalendarView("events")}
							>
								Events
							</button>
							<button
								className={`view-toggle-btn ${
									calendarView === "calendar" ? "active" : ""
								}`}
								onClick={() => setCalendarView("calendar")}
							>
								Calendar
							</button>
						</div>
					</div>
					<div className="widget-content">
						{calendarView === "events" ? (
							<ul className="events-list">
								{filteredEvents.length > 0 ? (
									filteredEvents.map((event) => (
										<li key={event.id} className="event-item">
											<div className="event-date">
												<span className="event-day">
													{new Date(event.date).getDate()}
												</span>
												<span className="event-month">
													{new Date(event.date).toLocaleString("default", {
														month: "short",
													})}
												</span>
											</div>
											<div className="event-details">
												<h3>{event.title}</h3>
												<p>
													{event.time} • {event.location}
												</p>
											</div>
										</li>
									))
								) : (
									<p className="no-data-message">No events this month</p>
								)}
							</ul>
						) : (
							<div className="calendar-grid">
								{weekdays.map((day) => (
									<div key={day} className="calendar-day-header">
										{day}
									</div>
								))}
								{calendarDays.map((day, index) => (
									<div
										key={index}
										className={`calendar-day ${day.empty ? "empty" : ""} ${
											day.hasEvent ? "has-event" : ""
										}`}
									>
										{day.day}
										{day.hasEvent && <div className="event-indicator"></div>}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="widget reminders-widget">
					<div className="widget-header">
						<h2>Reminders</h2>
						<button
							className="widget-action-btn"
							onClick={() => setShowAddReminderForm(true)}
						>
							+ Add
						</button>
					</div>
					<div className="widget-content">
						<Reminders
							userData={userData}
							showAddForm={showAddReminderForm}
							onCloseAddReminder={() => setShowAddReminderForm(false)}
						/>
					</div>
				</div>

				{/* Groups Widget - Bottom Right */}
				<div className="widget groups-widget">
					<div className="widget-header">
						<h2>Groups</h2>
						<button className="widget-action-btn">+ Join</button>
					</div>
					<div className="widget-content">
						{groups.length > 0 ? (
							<ul className="groups-list">
								{groups.map((group) => (
									<li key={group.id} className="group-item">
										<div className="group-icon">{group.name.charAt(0)}</div>
										<div className="group-details">
											<h3>{group.name}</h3>
											<p>
												{group.members} members •{" "}
												<span className="role-badge">{group.role}</span>
											</p>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className="no-data-message">
								You haven't joined any groups yet
							</p>
						)}
						<button className="view-all-btn">View All Groups</button>
					</div>
				</div>
			</div>

			{/* Chat Icon */}
			<div className="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
				<img
					src="/src/assets/message-icon.png"
					alt="Messages"
					className="chat-icon-image"
				/>
			</div>

			{/* Chat Popup */}
			{isChatOpen && (
				<div className="chat-popup">
					<div className="chat-header">
						<h3>Messages</h3>
						<button onClick={() => setIsChatOpen(false)}>×</button>
					</div>
					<div className="chat-content">
						<div className="chat-list">
							<div className="chat-conversation">
								<div className="chat-avatar">P</div>
								<div className="chat-preview">
									<h4>Pastor Mike</h4>
									<p>Looking forward to seeing you Sunday!</p>
								</div>
								<div className="chat-time">2h</div>
							</div>
							<div className="chat-conversation">
								<div className="chat-avatar">Y</div>
								<div className="chat-preview">
									<h4>Youth Group</h4>
									<p>Don't forget to bring snacks tomorrow</p>
								</div>
								<div className="chat-time">5h</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Home;
