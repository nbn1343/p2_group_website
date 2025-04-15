import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

function Calendar({ userData, groups, externalGroupFilter, setExternalGroupFilter, externalCalendarView, setExternalCalendarView }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [supabaseError, setSupabaseError] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Use external filter/view if provided, otherwise use local state
  const [activeGroupFilters, setActiveGroupFilters] = useState(externalGroupFilter || []);
  const [calendarView, setCalendarView] = useState(externalCalendarView || "calendar");

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
        label: group.name,
        color: group.color
      }))
    : [];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Sync with external filters when they change
  useEffect(() => {
    if (externalGroupFilter !== undefined) {
      setActiveGroupFilters(externalGroupFilter);
    }
  }, [externalGroupFilter]);

  // Sync with external view when it changes
  useEffect(() => {
    if (externalCalendarView !== undefined) {
      setCalendarView(externalCalendarView);
    }
  }, [externalCalendarView]);

  // Helper: parse groups properly from Supabase
  const parseGroups = (groupsData) => {
    if (!groupsData) return [];
    if (Array.isArray(groupsData)) return groupsData;
    if (typeof groupsData === "string" && 
        (groupsData.startsWith('[') || groupsData.startsWith('{'))) {
      try {
        return JSON.parse(groupsData);
      } catch (e) {
        return [groupsData];
      }
    }
    return [groupsData];
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      !day.empty &&
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getDate() === day.day
    );
  };

  // Helper: get group color by name
  const getGroupColor = (groupName) => {
    const cleanName = groupName.replace(/[\[\]"']/g, '').trim();
    const group = groups.find(g => g.name === cleanName);
    return group ? group.color : "#ccc";
  };

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
      const processedData = (data || []).map(event => ({
        ...event,
        parsedGroups: parseGroups(event.groups)
      }));
      setEvents(processedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userData) {
      fetchEvents();
    }
    // eslint-disable-next-line
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

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: "", empty: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = getDayEvents(dateString);
      const allGroups = [];
      dayEvents.forEach(event => {
        event.parsedGroups.forEach(group => {
          const cleanName = typeof group === 'string' ? 
            group.replace(/[\[\]"']/g, '').trim() : group;
          if (!allGroups.includes(cleanName)) {
            allGroups.push(cleanName);
          }
        });
      });
      days.push({
        day: i,
        date: dateString,
        hasEvent: dayEvents.length > 0,
        eventGroups: allGroups,
        empty: false,
      });
    }
    setCalendarDays(days);
    // eslint-disable-next-line
  }, [currentDate, events, activeGroupFilters]);

  // Filter events for the current month and by group
  const filteredEvents = events.filter((event) => {
    if (!event.date) return false;
    const eventDateParts = event.date.split('T')[0].split('-');
    const eventYear = parseInt(eventDateParts[0]);
    const eventMonth = parseInt(eventDateParts[1]) - 1;
    const dateMatches = eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();

    if (activeGroupFilters.length > 0) {
      return dateMatches && event.parsedGroups.some(group => {
        const cleanName = typeof group === 'string' ? 
          group.replace(/[\[\]"']/g, '').trim() : group;
        return activeGroupFilters.includes(cleanName);
      });
    }
    return dateMatches;
  });

  // Filter events for a specific day and by group
  const getDayEvents = (dateString) => {
    return events.filter((event) => {
      if (!event.date) return false;
      const eventDateString = event.date.split('T')[0];
      const dateMatches = eventDateString === dateString;
      if (activeGroupFilters.length > 0) {
        return dateMatches && event.parsedGroups.some(group => {
          const cleanName = typeof group === 'string' ? 
            group.replace(/[\[\]"']/g, '').trim() : group;
          return activeGroupFilters.includes(cleanName);
        });
      }
      return dateMatches;
    });
  };

  const handleDayClick = (day) => {
    if (day.empty) return;
    setSelectedDay(day.date);
    handleSetCalendarView("events");
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
        groups: JSON.stringify(groupsToSave),
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

  // Updated to also update external state
  const toggleGroupFilter = (groupName) => {
    let newFilters;
    if (activeGroupFilters.includes(groupName)) {
      newFilters = activeGroupFilters.filter(g => g !== groupName);
    } else {
      newFilters = [...activeGroupFilters, groupName];
    }
    
    setActiveGroupFilters(newFilters);
    
    // Update external state if provided
    if (setExternalGroupFilter) {
      setExternalGroupFilter(newFilters);
    }
  };

  // Updated to also update external state
  const handleSetCalendarView = (view) => {
    setCalendarView(view);
    
    // Update external state if provided
    if (setExternalCalendarView) {
      setExternalCalendarView(view);
    }
  };

  const clearFilters = () => {
    setActiveGroupFilters([]);
    if (setExternalGroupFilter) {
      setExternalGroupFilter([]);
    }
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
              {/* Group pills selector */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ marginBottom: 6, fontWeight: "bold" }}>Select Groups:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (newEventGroups.length === availableGroups.length) {
                        setNewEventGroups([]);
                      } else {
                        setNewEventGroups(availableGroups.map(g => g.value));
                      }
                    }}
                    className={`group-pill${newEventGroups.length === availableGroups.length ? " selected" : ""}`}
                    style={{
                      background: newEventGroups.length === availableGroups.length ? "#888" : "#222",
                      color: "#fff",
                      border: "1.5px solid #888",
                      fontWeight: "bold",
                      borderRadius: 20,
                      padding: "6px 16px",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.15s"
                    }}
                  >
                    All Groups
                  </button>
                  {availableGroups.map(group => {
                    const selected = newEventGroups.includes(group.value);
                    return (
                      <button
                        type="button"
                        key={group.value}
                        onClick={() => {
                          if (selected) {
                            setNewEventGroups(newEventGroups.filter(g => g !== group.value));
                          } else {
                            setNewEventGroups([...newEventGroups, group.value]);
                          }
                        }}
                        className={`group-pill${selected ? " selected" : ""}`}
                        style={{
                          background: selected ? group.color : "#222",
                          color: selected ? "#fff" : group.color,
                          border: `1.5px solid ${group.color}`,
                          fontWeight: "bold",
                          borderRadius: 20,
                          padding: "6px 16px",
                          cursor: "pointer",
                          outline: "none",
                          transition: "all 0.15s"
                        }}
                      >
                        <span style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: group.color,
                          marginRight: 8,
                          verticalAlign: "middle"
                        }} />
                        {group.label}
                      </button>
                    );
                  })}
                </div>
              </div>
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
            onClick={() => handleSetCalendarView("events")}
          >
            Events
          </button>
          <button
            className={`view-toggle-btn ${calendarView === "calendar" ? "active" : ""}`}
            onClick={() => {
              handleSetCalendarView("calendar");
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
                        <span style={{ color: group.color, fontWeight: "bold" }}>
                          ● {group.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
        {activeGroupFilters.length > 0 && (
          <div className="active-filters">
            <span>Filtered by: </span>
            {activeGroupFilters.map(filter => (
              <div 
                key={filter} 
                className="filter-tag"
                style={{ backgroundColor: `${getGroupColor(filter)}30`, color: getGroupColor(filter) }}
              >
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
                      <div className="event-groups">
                        Groups: {event.parsedGroups.map(groupName => {
                          const cleanName = typeof groupName === 'string' ? 
                            groupName.replace(/[\[\]"']/g, '').trim() : groupName;
                          return (
                            <span 
                              key={cleanName} 
                              style={{ 
                                color: getGroupColor(cleanName),
                                fontWeight: "bold",
                                marginRight: "6px"
                              }}
                            >
                              ● {cleanName}
                            </span>
                          );
                        })}
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
            {calendarDays.map((day, index) => {
              const dayGroups = day.eventGroups ? day.eventGroups.slice(0, 4) : [];
              return (
                <div
                  key={index}
                  className={`calendar-day${day.empty ? " empty" : ""}${isToday(day) ? " today" : ""}`}
                  onClick={() => !day.empty && handleDayClick(day)}
                  style={{ position: "relative" }}
                >
                  {day.day}
                  {!day.empty && dayGroups.length > 0 && (
                    <div style={{
                      display: "flex",
                      gap: 6,
                      position: "absolute",
                      bottom: 8,
                      left: 0,
                      right: 0,
                      justifyContent: "center"
                    }}>
                      {dayGroups.map((groupName, dotIndex) => {
                        const dotColor = getGroupColor(groupName);
                        return (
                          <span
                            key={`${groupName}-${dotIndex}`}
                            title={groupName}
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: dotColor,
                              display: "inline-block",
                              border: "2px solid #222"
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
