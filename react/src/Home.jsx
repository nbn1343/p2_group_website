import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  // Mock data for events
  const [events, setEvents] = useState([
    { id: 1, title: "Youth Bible Study", date: "2025-03-26", time: "6:00 PM", location: "Youth Room" },
    { id: 2, title: "Parent Committee", date: "2025-03-28", time: "7:00 PM", location: "Fellowship Hall" },
    { id: 3, title: "Sunday Service", date: "2025-03-30", time: "10:00 AM", location: "Main Sanctuary" }
  ]);

  // Mock data for groups
  const [groups, setGroups] = useState([
    { id: 1, name: "Youth Ministry", members: 24, role: "Member" },
    { id: 2, name: "Worship Team", members: 12, role: "Leader" },
    { id: 3, name: "Bible Study", members: 18, role: "Member" },
    { id: 4, name: "Outreach Committee", members: 8, role: "Member" }
  ]);

  // Mock data for reminders
  const [reminders, setReminders] = useState([
    { id: 1, text: "Prepare worship slides", dueDate: "2025-03-26", priority: "high" },
    { id: 2, text: "Bring snacks for youth group", dueDate: "2025-03-26", priority: "medium" },
    { id: 3, text: "Call new members", dueDate: "2025-03-29", priority: "medium" },
    { id: 4, text: "Submit budget proposal", dueDate: "2025-04-01", priority: "high" }
  ]);

  // Calendar data
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
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
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const hasEvent = events.some(event => event.date === dateString);
      
      days.push({
        day: i,
        date: dateString,
        hasEvent,
        empty: false
      });
    }
    
    setCalendarDays(days);
  }, [currentDate, events]);

  // Navigation for calendar
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="main-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <img src="/src/assets/Logo.png" alt="Faith Connect Logo" />
          <h1>Faith Connect</h1>
        </div>
        <div className="user-controls">
          <span className="username">Welcome, User</span>
          <button className="logout-btn">Log Out</button>
        </div>
      </header>

      <div className="widgets-container">
        {/* Events Widget - Top Left */}
        <div className="widget events-widget">
          <div className="widget-header">
            <h2>Upcoming Events</h2>
            <button className="widget-action-btn">+ Add</button>
          </div>
          <div className="widget-content">
            {events.length > 0 ? (
              <ul className="events-list">
                {events.map(event => (
                  <li key={event.id} className="event-item">
                    <div className="event-date">
                      <span className="event-day">{new Date(event.date).getDate()}</span>
                      <span className="event-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="event-details">
                      <h3>{event.title}</h3>
                      <p>{event.time} • {event.location}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data-message">No upcoming events</p>
            )}
            <button className="view-all-btn">View All Events</button>
          </div>
        </div>

        {/* Calendar Widget - Top Right */}
        <div className="widget calendar-widget">
          <div className="widget-header">
            <h2>Calendar</h2>
            <div className="calendar-navigation">
              <button onClick={prevMonth}>◀</button>
              <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              <button onClick={nextMonth}>▶</button>
            </div>
          </div>
          <div className="widget-content">
            <div className="calendar-grid">
              {weekdays.map(day => (
                <div key={day} className="calendar-day-header">{day}</div>
              ))}
              
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`calendar-day ${day.empty ? 'empty' : ''} ${day.hasEvent ? 'has-event' : ''}`}
                >
                  {day.day}
                  {day.hasEvent && <div className="event-indicator"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Groups Widget - Bottom Left */}
        <div className="widget groups-widget">
          <div className="widget-header">
            <h2>My Groups</h2>
            <button className="widget-action-btn">+ Join</button>
          </div>
          <div className="widget-content">
            {groups.length > 0 ? (
              <ul className="groups-list">
                {groups.map(group => (
                  <li key={group.id} className="group-item">
                    <div className="group-icon">{group.name.charAt(0)}</div>
                    <div className="group-details">
                      <h3>{group.name}</h3>
                      <p>{group.members} members • <span className="role-badge">{group.role}</span></p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data-message">You haven't joined any groups yet</p>
            )}
            <button className="view-all-btn">View All Groups</button>
          </div>
        </div>

        {/* Reminders Widget - Bottom Right */}
        <div className="widget reminders-widget">
          <div className="widget-header">
            <h2>Reminders</h2>
            <button className="widget-action-btn">+ Add</button>
          </div>
          <div className="widget-content">
            {reminders.length > 0 ? (
              <ul className="reminders-list">
                {reminders.map(reminder => (
                  <li key={reminder.id} className="reminder-item priority-${reminder.priority}">
                    <input type="checkbox" id={`reminder-${reminder.id}`} />
                    <div className="reminder-details">
                      <label htmlFor={`reminder-${reminder.id}`}>{reminder.text}</label>
                      <p>Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data-message">No reminders</p>
            )}
            <button className="view-all-btn">View All Reminders</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
