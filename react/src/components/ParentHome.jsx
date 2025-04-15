import { useState } from "react";
import "../design/Home.css";
import Calendar from "../modal/Calendar";
import Reminders from "../modal/Reminders";
import GroupModal from "../modal/GroupModal";
import ChatModal from "../modal/ChatModal";

function ParentHome({ userData, onLogout, children }) {
  // User info
  const firstName = userData?.user_metadata?.first_name || "User";

  // State for selected child filter
  const [selectedChild, setSelectedChild] = useState("All");

  // Mock data for groups with colors
  const GROUP_COLORS = [
    "#4ED1C4", // Teal (Youth Ministry)
    "#FFB347", // Orange (Worship Team)
    "#6C63FF", // Purple (Bible Study)
    "#FF6B6B", // Red (Outreach Committee)
    "#FFD166", // Yellow
    "#43AA8B", // Green
    "#3A86FF", // Blue
  ];

  const [groups, setGroups] = useState([
    { id: 1, name: "Youth Ministry", members: 24, role: "Member", description: "Weekly activities and events for our church youth.", meetingTime: "Sundays at 4 PM", location: "Fellowship Hall", color: GROUP_COLORS[0] },
    { id: 2, name: "Worship Team", members: 12, role: "Leader", description: "Music ministry team for Sunday services and special events.", meetingTime: "Thursdays at 7 PM", location: "Sanctuary", color: GROUP_COLORS[1] },
    { id: 3, name: "Bible Study", members: 18, role: "Member", description: "Weekly Bible study focusing on different books and themes.", meetingTime: "Wednesdays at 6:30 PM", location: "Room 201", color: GROUP_COLORS[2] },
    { id: 4, name: "Outreach Committee", members: 8, role: "Member", description: "Planning and coordinating community outreach events.", meetingTime: "First Monday of month at 6 PM", location: "Conference Room", color: GROUP_COLORS[3] },
  ]);

  const [calendarGroupFilter, setCalendarGroupFilter] = useState([]);
  const [calendarView, setCalendarView] = useState("calendar");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatGroup, setActiveChatGroup] = useState(null);

  const handleChildChange = (event) => {
    setSelectedChild(event.target.value);
    // Optionally filter data based on the selected child
    if (event.target.value !== "All") {
      console.log(`Filtering dashboard for child ID ${event.target.value}`);
      // Implement filtering logic here if needed
    }
  };

  return (
    <div className="main-dashboard">
      <header className="dashboard-header">
  <div className="header-left">
    <div className="logo">
      <img src="/Logo.png" alt="Faith Connect Logo" />
    </div>
    <div className="child-filter">
      <label htmlFor="child-select" className="child-filter-label">Filter by Child:</label>
      <select
        id="child-select"
        value={selectedChild}
        onChange={handleChildChange}
        className="child-filter-dropdown"
      >
        <option value="All">All</option>
        {children.map((child) => (
          <option key={child.id} value={child.id}>
            {child.name}
          </option>
        ))}
      </select>
    </div>
  </div>
  <div className="user-controls">
    <span className="username">Welcome, {firstName}</span>
    {userData && (
      <img
        src="/profile-icon.png"
        alt="Profile"
        className="profile-icon"
        onClick={() => setEditProfile(true)}
      />
    )}
    <button className="logout-btn" onClick={onLogout}>
      Log Out
    </button>
  </div>
</header>


      {/* Widgets */}
      <div className="widgets-container">
        {/* Calendar Widget */}
        <div className="widget calendar-widget">
          <Calendar 
            userData={userData} 
            groups={groups}
            externalGroupFilter={calendarGroupFilter}
            setExternalGroupFilter={setCalendarGroupFilter}
            externalCalendarView={calendarView}
            setExternalCalendarView={setCalendarView}
          />
        </div>

        {/* Reminders Widget */}
        <div className="widget reminders-widget">
          <div className="widget-header">
            <h2>Reminders</h2>
          </div>
          <div className="widget-content">
            <Reminders userData={userData} showAddForm={false} />
          </div>
        </div>

        {/* Groups Widget */}
        <div className="widget groups-widget">
          <div className="widget-header">
            <h2>Groups</h2>
          </div>
          <div className="widget-content">
            {groups.length > 0 ? (
              <ul className="groups-list">
                {groups.map((group) => (
                  <li key={group.id} className="group-item">
                    <div 
                      className="group-icon"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.name.charAt(0)}
                    </div>
                    <div className="group-details">
                      <h3>{group.name}</h3>
                      <p>{group.members} members •{" "}
                        <span className="role-badge">{group.role}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No groups available</p>
            )}
          </div>
        </div>

        {/* Chat Modal */}
        {isChatOpen && (
          <ChatModal
            onClose={() => setIsChatOpen(false)}
            activeChatGroup={activeChatGroup}
            activeChatId={activeChatId}
            groups={groups}
            onChangeChat={(group) => {
              setActiveChatId(group.name);
              setActiveChatGroup(group);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ParentHome;
