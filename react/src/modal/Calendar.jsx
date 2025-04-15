import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

function Calendar({ userData, groups }) {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [calendarDays, setCalendarDays] = useState([]);
	const [calendarView, setCalendarView] = useState("calendar");
	const [showAddEventForm, setShowAddEventForm] = useState(false);
	const [selectedDay, setSelectedDay] = useState(null);
	const [validationError, setValidationError] = useState("");
	const [supabaseError, setSupabaseError] = useState("");
	// Add filter state
	const [activeGroupFilters, setActiveGroupFilters] = useState([]);
	const [showFilterDropdown, setShowFilterDropdown] = useState(false);

	// Event form state
	const [newEventTitle, setNewEventTitle] = useState("");
	const [newEventDate, setNewEventDate] = useState("");
	const [newEventTime, setNewEventTime] = useState("");
	const [newEventLocation, setNewEventLocation] = useState("");
	const [newEventGroups, setNewEventGroups] = useState([]);

	// Use group names from props for the select options
	const availableGroups = groups
		? groups.map(group => ({
			value: group.name,
			label: group.name
		}))
		: [];

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

		// Filter events based on active group filters
		const filteredEventsByGroup = activeGroupFilters.length > 0
			? events.filter(event => {
				// If event.groups is a string, convert to array
				const eventGroups = Array.isArray(event.groups) ? event.groups : [event.groups];
				// Check if any of the event's groups match the active filters
				return eventGroups.some(group => activeGroupFilters.includes(group));
			})
			: events;

		// Add days of the month with event check
		for (let i = 1; i <= daysInMonth; i++) {
			const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
			const hasEvent = filteredEventsByGroup.some((event) => {
				const eventDateString = event.date.split('T')[0];
				return eventDateString === dateString;
			});
			days.push({
				day: i,
				date: dateString,
				hasEvent,
				empty: false,
			});
		}

		setCalendarDays(days);
	}, [currentDate, events, activeGroupFilters]);

	// Filter events for the current month and by group
	const filteredEvents = events.filter((event) => {
		if (!event.date) return false;
		
		const eventDateParts = event.date.split('T')[0].split('-');
		const eventYear = parseInt(eventDateParts[0]);
		const eventMonth = parseInt(eventDateParts[1]) - 1;
		
		// First filter by date
		const dateMatches = eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();
		
		// If group filters are active, also filter by group
		if (activeGroupFilters.length > 0) {
			const eventGroups = Array.isArray(event.groups) ? event.groups : [event.groups];
			return dateMatches && eventGroups.some(group => activeGroupFilters.includes(group));
		}
		
		return dateMatches;
	});

	// Filter events for a specific day and by group
	const getDayEvents = (dateString) => {
		return events.filter((event) => {
			if (!event.date) return false;
			
			const eventDateString = event.date.split('T')[0];
			const dateMatches = eventDateString === dateString;
			
			// If group filters are active, also filter by group
			if (activeGroupFilters.length > 0) {
				const eventGroups = Array.isArray(event.groups) ? event.groups : [event.groups];
				return dateMatches && eventGroups.some(group => activeGroupFilters.includes(group));
			}
			
			return dateMatches;
		});
	};

	const handleDayClick = (day) => {
		if (day.empty) return;
		setSelectedDay(day.date);
		setCalendarView("events");
	};

	// Add a new event
	const addEvent = async (e) => {
		e.preventDefault();

		if (
			!newEventTitle ||
			!newEventDate ||
			!newEventTime ||
			!newEventLocation ||
			newEventGroups.length === 0
		) {
			setValidationError("Please fill out all fields.");
			return;
		}

		setValidationError("");
		setSupabaseError("");

		// If "all" is selected, use all available groups
		const groupsToSave = newEventGroups.includes("all")
			? availableGroups.map(g => g.value)
			: newEventGroups;

		const { error } = await supabase.from("events").insert([
			{
				title: newEventTitle,
				date: newEventDate,
				time: newEventTime,
				location: newEventLocation,
				user_id: userData.id,
				groups: groupsToSave, // Store as array (recommended)
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

	const resetEventForm = () => {
		setNewEventTitle("");
		setNewEventDate("");
		setNewEventTime("");
		setNewEventLocation("");
		setNewEventGroups([]);
		setValidationError("");
	};

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

	const formatDate = (dateString) => {
		const [year, month, day] = dateString.split('-');
		return new Date(year, month - 1, day).toLocaleDateString();
	};

	// Toggle group filter
	const toggleGroupFilter = (groupName) => {
		if (activeGroupFilters.includes(groupName)) {
			// Remove the group filter
			setActiveGroupFilters(activeGroupFilters.filter(g => g !== groupName));
		} else {
			// Add the group filter
			setActiveGroupFilters([...activeGroupFilters, groupName]);
		}
	};

	// Clear all filters
	const clearFilters = () => {
		setActiveGroupFilters([]);
		setShowFilterDropdown(false);
	};

	if (loading) return <div>Loading calendar...</div>;

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
							{/* Multi-select for groups */}
							<select
								multiple
								value={newEventGroups}
								onChange={e => {
									const selected = Array.from(e.target.selectedOptions, option => option.value);
									if (selected.includes("all")) {
										setNewEventGroups(["all", ...availableGroups.map(g => g.value)]);
									} else {
										setNewEventGroups(selected);
									}
								}}
								style={{ minHeight: "80px", marginBottom: "1rem" }}
							>
								<option value="all">All Groups</option>
								{availableGroups.map(group => (
									<option key={group.value} value={group.value}>{group.label}</option>
								))}
							</select>
							<button
								type="submit"
								disabled={
									!newEventTitle ||
									!newEventDate ||
									!newEventTime ||
									!newEventLocation ||
									newEventGroups.length === 0
								}
							>
								Add Event
							</button>
						</form>
					</div>
				</div>
			)}
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
						className={`view-toggle-btn ${calendarView === "events" ? "active" : ""}`}
						onClick={() => setCalendarView("events")}
					>
						Events
					</button>
					<button
						className={`view-toggle-btn ${calendarView === "calendar" ? "active" : ""}`}
						onClick={() => {
							setCalendarView("calendar");
							setSelectedDay(null);
						}}
					>
						Calendar
					</button>
					{/* Filter Button */}
					<div className="filter-dropdown-container">
						<button
							className={`widget-action-btn ${activeGroupFilters.length > 0 ? "active" : ""}`}
							onClick={() => setShowFilterDropdown(!showFilterDropdown)}
							style={{ marginLeft: "8px" }}
						>
							Filter {activeGroupFilters.length > 0 ? `(${activeGroupFilters.length})` : ""}
						</button>
						{/* Filter Dropdown */}
						{showFilterDropdown && (
							<div className="filter-dropdown">
								<div className="filter-header">
									<h3>Filter by Group</h3>
									<button onClick={clearFilters} className="clear-filters">Clear All</button>
								</div>
								<div className="filter-options">
									{availableGroups.map(group => (
										<div key={group.value} className="filter-option">
											<label>
												<input
													type="checkbox"
													checked={activeGroupFilters.includes(group.value)}
													onChange={() => toggleGroupFilter(group.value)}
												/>
												{group.label}
											</label>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
					{/* Add Button */}
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
				{/* Active Filters Display */}
				{activeGroupFilters.length > 0 && (
					<div className="active-filters">
						<span>Filtered by: </span>
						{activeGroupFilters.map(filter => (
							<div key={filter} className="filter-tag">
								{filter}
								<button onClick={() => toggleGroupFilter(filter)} className="remove-filter">×</button>
							</div>
						))}
					</div>
				)}
				
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
												{event.date ? event.date.split('T')[0].split('-')[2] : ''}
											</span>
											<span className="event-month">
												{event.date ?
													new Date(0, parseInt(event.date.split('T')[0].split('-')[1]) - 1).toLocaleString("default", { month: "short" }) :
													''
												}
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
											{/* Show groups */}
											<div className="event-groups">
												Groups: {Array.isArray(event.groups) ? event.groups.join(", ") : event.groups}
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
										: activeGroupFilters.length > 0
											? "No events match the selected group filters"
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
								className={`calendar-day ${day.empty ? "empty" : ""} ${day.hasEvent ? "has-event" : ""}`}
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