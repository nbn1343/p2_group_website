import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

function Calendar({ userData }) {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [calendarDays, setCalendarDays] = useState([]);
	const [calendarView, setCalendarView] = useState("calendar");
	const [showAddEventForm, setShowAddEventForm] = useState(false);
	const [selectedDay, setSelectedDay] = useState(null);
	const [validationError, setValidationError] = useState("");
	const [supabaseError, setSupabaseError] = useState("");
	
	// Event form state
	const [newEventTitle, setNewEventTitle] = useState("");
	const [newEventDate, setNewEventDate] = useState("");
	const [newEventTime, setNewEventTime] = useState("");
	const [newEventLocation, setNewEventLocation] = useState("");
	
	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	
	// Fetch events from Supabase
	const fetchEvents = async () => {
		setLoading(true);
		setSupabaseError("");
		const { data, error } = await supabase
			.from("events")
			.select("*")
			.eq("user_id", userData.id)
			.order("date", { ascending: true });
		
		if (error) {
			setSupabaseError(error.message);
		} else {
			setEvents(data || []);
		}
		setLoading(false);
	};
	
	useEffect(() => {
		if (userData) {
			fetchEvents();
		}
	}, [userData]);
	
	// Generate calendar days based on current month/year
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
			
			// Check if there are events on this day
			const hasEvent = events.some((event) => {
				const eventDate = new Date(event.date);
				return (
					eventDate.getDate() === i &&
					eventDate.getMonth() === month &&
					eventDate.getFullYear() === year
				);
			});

			days.push({
				day: i,
				date: dateString,
				hasEvent,
				empty: false,
			});
		}

		setCalendarDays(days);
	}, [currentDate, events]);
	
	// Filter events for the current month
	const filteredEvents = events.filter((event) => {
		const eventDate = new Date(event.date);
		return (
			eventDate.getMonth() === currentDate.getMonth() &&
			eventDate.getFullYear() === currentDate.getFullYear()
		);
	});
	
	// Filter events for a specific day
	const getDayEvents = (dateString) => {
		return events.filter((event) => event.date === dateString);
	};
	
	// Handle day click to show that day's events
	const handleDayClick = (day) => {
		if (day.empty) return;
		
		setSelectedDay(day.date);
		setCalendarView("events");
	};
	
	// Add a new event
	const addEvent = async (e) => {
		e.preventDefault();
		
		if (!newEventTitle || !newEventDate || !newEventTime || !newEventLocation) {
			setValidationError("Please fill out all fields.");
			return;
		}
		
		setValidationError("");
		setSupabaseError("");
		
		const { error } = await supabase.from("events").insert([
			{
				title: newEventTitle,
				date: newEventDate,
				time: newEventTime,
				location: newEventLocation,
				user_id: userData.id,
			},
		]);
		
		if (error) {
			setSupabaseError(error.message);
		} else {
			resetEventForm();
			await fetchEvents();
			setShowAddEventForm(false);
		}
	};
	
	// Update an event
	const updateEvent = async (event, field, value) => {
		setSupabaseError("");
		
		const updatedEvent = { ...event, [field]: value };
		
		const { error } = await supabase
			.from("events")
			.update(updatedEvent)
			.eq("id", event.id);
			
		if (error) {
			setSupabaseError(error.message);
		} else {
			fetchEvents();
		}
	};
	
	// Delete an event
	const deleteEvent = async (id) => {
		setSupabaseError("");
		
		const { error } = await supabase
			.from("events")
			.delete()
			.eq("id", id);
			
		if (error) {
			setSupabaseError(error.message);
		} else {
			fetchEvents();
		}
	};
	
	// Reset the event form
	const resetEventForm = () => {
		setNewEventTitle("");
		setNewEventDate("");
		setNewEventTime("");
		setNewEventLocation("");
		setValidationError("");
	};
	
	// Calendar navigation
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
	
	// Format date for display
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	};
	
	if (loading) return <div>Loading calendar...</div>;
	
	// Calculate which events to show based on calendarView and selectedDay
	let eventsToShow = filteredEvents;
	if (calendarView === "events" && selectedDay) {
		eventsToShow = getDayEvents(selectedDay);
	}
	
	return (
		<div>
			{/* ───── ADD EVENT MODAL ───── */}
			{showAddEventForm && (
				<div className="reminder-modal">
					<div className="reminder-container">
						<button className="close-button" onClick={() => {
							setShowAddEventForm(false);
							resetEventForm();
						}}>
							×
						</button>
						<h2>Add Event</h2>
						{validationError && (
							<div style={{ color: "red", marginBottom: "1rem" }}>
								{validationError}
							</div>
						)}
						<form onSubmit={addEvent} className="add-reminder-form">
							<input
								type="text"
								placeholder="Event Title"
								value={newEventTitle}
								onChange={(e) => setNewEventTitle(e.target.value)}
							/>
							<input
								type="date"
								value={newEventDate}
								onChange={(e) => setNewEventDate(e.target.value)}
							/>
							<input
								type="time"
								value={newEventTime}
								onChange={(e) => setNewEventTime(e.target.value)}
							/>
							<input
								type="text"
								placeholder="Location"
								value={newEventLocation}
								onChange={(e) => setNewEventLocation(e.target.value)}
							/>
							<button
								type="submit"
								disabled={!newEventTitle || !newEventDate || !newEventTime || !newEventLocation}
							>
								Add Event
							</button>
						</form>
					</div>
				</div>
			)}
			
			{/* ───── SUPABASE ERROR ───── */}
			{/* {supabaseError && (
				<div style={{ color: "red", margin: "1rem" }}>
					Error: {supabaseError}
				</div>
			)}
			 */}
			{/* ───── CALENDAR HEADER ───── */}
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
						onClick={() => {
							setCalendarView("calendar");
							setSelectedDay(null);
						}}
					>
						Calendar
					</button>
					<button
						className="widget-action-btn"
						onClick={() => setShowAddEventForm(true)}
						style={{ marginLeft: "8px" }}
					>
						+ Add
					</button>
				</div>
			</div>
			
			{/* ───── CALENDAR CONTENT ───── */}
			<div className="widget-content">
				{calendarView === "events" ? (
					<div>
						{selectedDay && (
							<div className="selected-day-header">
								<button 
									onClick={() => setSelectedDay(null)}
									className="back-button"
								>
									← All Events
								</button>
								<h3>Events for {formatDate(selectedDay)}</h3>
							</div>
						)}
						<ul className="events-list">
							{eventsToShow.length > 0 ? (
								eventsToShow.map((event) => (
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
											<input 
												type="text"
												className="event-title-input"
												value={event.title}
												onChange={(e) => updateEvent(event, "title", e.target.value)}
											/>
											<div className="event-meta">
												<input 
													type="time"
													className="event-time-input"
													value={event.time}
													onChange={(e) => updateEvent(event, "time", e.target.value)}
												/>
												<span> • </span>
												<input 
													type="text"
													className="event-location-input"
													value={event.location}
													onChange={(e) => updateEvent(event, "location", e.target.value)}
												/>
											</div>
										</div>
										<button 
											onClick={() => deleteEvent(event.id)}
											className="delete-btn"
										>
											Delete
										</button>
									</li>
								))
							) : (
								<p className="no-data-message">
									{selectedDay 
										? "No events scheduled for this day" 
										: "No events this month"}
								</p>
							)}
						</ul>
					</div>
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
								onClick={() => !day.empty && handleDayClick(day)}
							>
								{day.day}
								{day.hasEvent && <div className="event-indicator"></div>}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default Calendar;