import { useState, useEffect } from "react";
import "../design/Home.css";
import Calendar from "../modal/Calendar";
import Reminders from "../modal/Reminders";
import GroupModal from "../modal/GroupModal";
import ChatModal from "../modal/ChatModal";

function ParentHome({ userData, onLogout, children }) {
  // User info
  const firstName = userData?.user_metadata?.first_name || "Parent";

  // State management
  const [selectedChild, setSelectedChild] = useState("All");
  const [currentGroups, setCurrentGroups] = useState([]);
  const [calendarGroupFilter, setCalendarGroupFilter] = useState([]);
  const [calendarView, setCalendarView] = useState("calendar");

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatGroup, setActiveChatGroup] = useState(null);

  // Group modal states
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  // Profile edit states
  const [editProfile, setEditProfile] = useState(false);
  const [name, setName] = useState(userData?.user_metadata?.first_name || '');
  const [email, setEmail] = useState(userData?.user_metadata?.email || '');
  const [phone, setPhone] = useState(userData?.user_metadata?.phone || '');
  const [role, setRole] = useState(userData?.user_metadata?.role || '');
  const [profileImage, setProfileImage] = useState(null);

  // Open join group modal
  const openJoinGroupModal = () => {
    setSelectedGroup(null);
    setJoinCode("");
    setJoinError("");
    setShowJoinGroupModal(true);
  };

  // Open group details modal
  const openGroupDetails = (group) => {
    setSelectedGroup(group);
    setJoinCode("");
    setJoinError("");
    setShowJoinGroupModal(true);
  };

  // Handle joining a group with a code
  const handleJoinGroup = () => {
    if (!joinCode.trim()) {
      setJoinError("Please enter a valid join code");
      return;
    }
    // Mock functionality
    if (joinCode === "DEMO123") {
      const newGroup = {
        id: groups.length + 1,
        name: "Prayer Team",
        members: 15,
        role: "Member",
        description: "Daily prayer meetings and prayer request coordination.",
        meetingTime: "Tuesdays at 7 AM",
        location: "Prayer Room",
        color: GROUP_COLORS[groups.length % GROUP_COLORS.length] // Assign next color in rotation
      };
      setGroups([...groups, newGroup]);
      setShowJoinGroupModal(false);
      setJoinCode("");
      setJoinError("");
    } else {
      setJoinError("Invalid join code. Please try again.");
    }
  };


  // Group configuration
  const GROUP_COLORS = [
    "#4ED1C4", "#FFB347", "#6C63FF", "#FF6B6B", "#FFD166", "#43AA8B", "#3A86FF"
  ];

  // Group configurations indexed by name (lowercase) for easy lookup
  const groupConfigurations = {
    all: [
      { id: 1, name: "Parent Council", members: 15, role: "Member", description: "Parent coordination group", meetingTime: "Monthly", location: "Conference Room", color: GROUP_COLORS[0] },
      { id: 2, name: "Family Support", members: 20, role: "Volunteer", description: "Family assistance program", meetingTime: "Wednesdays 3 PM", location: "Community Center", color: GROUP_COLORS[1] }
    ],
    alice: [
      { id: 3, name: "Youth", members: 15, role: "Singer", description: "Weekly choir practice", meetingTime: "Mondays 5 PM", location: "Music Room", color: GROUP_COLORS[0] },
      { id: 4, name: "Young Womens", members: 10, role: "Player", description: "Church basketball league", meetingTime: "Wednesdays 6 PM", location: "Gym", color: GROUP_COLORS[1] }
    ],
    bob: [
      { id: 5, name: "Deacans Quorum", members: 8, role: "Operator", description: "Audio/visual team", meetingTime: "Saturdays 10 AM", location: "Sanctuary", color: GROUP_COLORS[2] },
      { id: 6, name: "Youth", members: 12, role: "Member", description: "Coding and tech projects", meetingTime: "Fridays 4 PM", location: "Computer Lab", color: GROUP_COLORS[3] }
    ],
    jimmy: [
      { id: 7, name: "Youth", members: 20, role: "Volunteer", description: "Community service projects", meetingTime: "Sundays 1 PM", location: "Various", color: GROUP_COLORS[4] }
    ],
    john: [
      { id: 8, name: "Priest Quorum", members: 6, role: "Guitarist", description: "Contemporary worship music", meetingTime: "Fridays 4 PM", location: "Sanctuary", color: GROUP_COLORS[5] },
      { id: 9, name: "Youth", members: 10, role: "Member", description: "Creative arts group", meetingTime: "Tuesdays 3 PM", location: "Art Room", color: GROUP_COLORS[6] }
    ]
  };

  // Place this near your groupConfigurations in ParentHome.jsx

  const calendarConfigurations = {
    all: [
      { id: 1, title: "Parent Council Meeting", date: "2025-04-15", time: "6:00 PM", location: "Conference Room", groups: ["Parent Council"] },
      { id: 2, title: "Family Support Session", date: "2025-04-17", time: "3:00 PM", location: "Community Center", groups: ["Family Support"] }
    ],
    alice: [
      { id: 1, title: "Choir Practice", date: "2025-04-20", time: "5:00 PM", location: "Music Room", groups: ["Youth Choir"] },
      { id: 2, title: "Basketball Game", date: "2025-04-22", time: "6:00 PM", location: "Gym", groups: ["Basketball Team"] },
      { id: 3, title: "Youth Group Meeting", date: "2025-04-25", time: "4:00 PM", location: "Fellowship Hall", groups: ["Youth Choir"] }
    ],
    bob: [
      { id: 1, title: "Tech Crew Setup", date: "2025-04-18", time: "10:00 AM", location: "Sanctuary", groups: ["Tech Crew"] },
      { id: 2, title: "Programming Workshop", date: "2025-04-19", time: "4:00 PM", location: "Computer Lab", groups: ["Programming Club"] },
      { id: 3, title: "Audio/Visual Training", date: "2025-04-21", time: "3:00 PM", location: "Sanctuary", groups: ["Tech Crew"] }
    ],
    jimmy: [
      { id: 1, title: "Community Cleanup", date: "2025-04-20", time: "1:00 PM", location: "City Park", groups: ["Outreach Team"] },
      { id: 2, title: "Volunteer Meeting", date: "2025-04-23", time: "2:00 PM", location: "Community Center", groups: ["Outreach Team"] },
      { id: 3, title: "Charity Event", date: "2025-04-26", time: "11:00 AM", location: "Downtown Plaza", groups: ["Outreach Team"] }
    ],
    john: [
      { id: 1, title: "Band Practice", date: "2025-04-19", time: "4:00 PM", location: "Sanctuary", groups: ["Worship Band"] },
      { id: 2, title: "Art Workshop", date: "2025-04-21", time: "3:00 PM", location: "Art Room", groups: ["Art Club"] },
      { id: 3, title: "Sunday Worship", date: "2025-04-27", time: "10:00 AM", location: "Sanctuary", groups: ["Worship Band"] }
    ]
  };


  // Initialize with default groups
  useEffect(() => {
    setCurrentGroups(groupConfigurations.all);
  }, []);

  // Handle child selection
  const handleChildChange = (event) => {
    const childId = event.target.value;
    setSelectedChild(childId);

    console.log("Selected child ID:", childId);

    if (childId === "All") {
      setCurrentGroups(groupConfigurations.all);
      console.log("Setting groups to 'all':", groupConfigurations.all);
    } else {
      // Convert ID to number for comparison (App.jsx passes numeric IDs)
      const childIdNum = Number(childId);
      const child = children.find(c => c.id === childIdNum);

      if (child) {
        const childName = child.name.toLowerCase();
        console.log("Found child:", child.name, "Looking for groups:", childName);

        if (groupConfigurations[childName]) {
          setCurrentGroups(groupConfigurations[childName]);
          console.log("Setting groups to:", groupConfigurations[childName]);
        } else {
          setCurrentGroups([]);
          console.log("No groups found for:", childName);
        }
      } else {
        console.log("Child not found for ID:", childId);
        setCurrentGroups([]);
      }
    }
  };

  // Handle profile image change
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: name,
        email: email,
        phone: phone,
      },
    });
    if (error) {
      console.log("Profile update error:", error.message);
    } else {
      setEditProfile(false);
    }
  };

  // Open chat with specific group
  const handleMessageGroup = (group) => {
    setActiveChatId(group.name);
    setActiveChatGroup(group);
    setIsChatOpen(true);
    setShowJoinGroupModal(false);
  };

  // Handler for "View Calendar" button in group modal
  const handleViewCalendar = (group) => {
    setCalendarGroupFilter([group.name]);
    setCalendarView("calendar");
    setShowJoinGroupModal(false);
  };

  // Open chat icon clicked
  const openGeneralChat = () => {
    // If no chat is active, open the first group by default
    if (!activeChatGroup) {
      setActiveChatId(currentGroups[0].name);
      setActiveChatGroup(currentGroups[0]);
    }
    setIsChatOpen(true);
  };

  // --- PROFILE EDIT SECTION WITH EXIT BUTTON ---
  if (editProfile) {
    return (
      <div className="profile-edit">
        <button
          className="exit-edit-btn"
          onClick={() => setEditProfile(false)}
          aria-label="Exit profile edit"
        >
          ×
        </button>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </label>
        <label>
          Role:
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <label>
          Profile Image:
          <input type="file" onChange={handleImageChange} />
          {profileImage && <img src={profileImage} alt="Profile Preview" className="profile-image-preview" />}
        </label>
        <button onClick={handleSaveProfile}>
          Save Changes
        </button>
      </div>
    );
  }

  return (
    <div className="main-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <img src="/Logo.png" alt="Faith Connect Logo" />
          </div>
          <div className="child-filter">
            <label htmlFor="child-select" className="child-filter-label">
              Filter by Child:
            </label>
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

      <div className="widgets-container">
        {/* Calendar Widget */}
        <div className="widget calendar-widget">
          <Calendar
            userData={userData}
            groups={currentGroups}
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
            <h2>
              {selectedChild === "All"
                ? "All Groups"
                : `${children.find(c => c.id === Number(selectedChild))?.name}'s Groups`}
            </h2>
          </div>
          <div className="widget-content">
            {currentGroups && currentGroups.length > 0 ? (
              <ul className="groups-list">
                {currentGroups.map((group) => (
                  <li key={group.id} className="group-item" onClick={() => openGroupDetails(group)}>
                    <div
                      className="group-icon"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.name.charAt(0)}
                    </div>
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
                {selectedChild !== "All"
                  ? `${children.find(c => c.id === Number(selectedChild))?.name} hasn't joined any groups yet`
                  : "No groups available"}
              </p>
            )}
          </div>
        </div>

        {/* Group Modal */}
        {showJoinGroupModal && (
          <GroupModal
            onClose={() => setShowJoinGroupModal(false)}
            selectedGroup={selectedGroup}
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            joinError={joinError}
            onJoinGroup={handleJoinGroup}
            onMessageGroup={handleMessageGroup}
            onViewCalendar={handleViewCalendar}
          />
        )}

        {/* Chat Icon */}
        <div className="chat-icon" onClick={openGeneralChat}>
          <img
            src="/message-icon.png"
            alt="Messages"
            className="chat-icon-image"
          />
        </div>

        {/* Chat Modal */}
        {isChatOpen && (
          <ChatModal
            onClose={() => setIsChatOpen(false)}
            activeChatGroup={activeChatGroup}
            activeChatId={activeChatId}
            groups={currentGroups}
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
