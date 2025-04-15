import { useState, useEffect } from "react";
import "../design/Home.css";
import Reminders from "../modal/Reminders";
import Calendar from "../modal/Calendar";
import GroupModal from "../modal/GroupModal";
import ChatModal from "../modal/ChatModal";
import { supabase } from "../utils/supabase";

function YouthHome({ userData, onLogout }) {
	// User info
	const firstName = userData?.user_metadata?.first_name || "User";

	// Reminders
	const [showAddReminderForm, setShowAddReminderForm] = useState(false);

	// Define group colors
	const GROUP_COLORS = [
		"#4ED1C4", // Teal (Youth Ministry)
		"#FFB347", // Orange (Worship Team)
		"#6C63FF", // Purple (Bible Study)
		"#FF6B6B", // Red (Outreach Committee)
		"#FFD166", // Yellow
		"#43AA8B", // Green
		"#3A86FF", // Blue
	];

	// Mock data for groups with colors
	const [groups, setGroups] = useState([
		{ id: 1, name: "Teachers Quorum", members: 24, role: "Member", description: "Weekly activities and events for our teachers age 14-16.", meetingTime: "Sundays at 4 PM", location: "Teacher's Room", color: GROUP_COLORS[0] },
		{ id: 2, name: "Youth", members: 12, role: "Member", description: "Weekly activities and events for our youth.", meetingTime: "Thursdays at 7 PM", location: "Church", color: GROUP_COLORS[1] },
	]);

	// Calendar filter and view state
	const [calendarGroupFilter, setCalendarGroupFilter] = useState([]);
	const [calendarView, setCalendarView] = useState("calendar");

	// Chat state
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
			setActiveChatId(groups[0].name);
			setActiveChatGroup(groups[0]);
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
				<div className="logo">
					<img src="/Logo.png" alt="Faith Connect Logo" />
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
				{/* Calendar Widget - Left */}
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
						<button
							className="widget-action-btn"
							onClick={openJoinGroupModal}
						>
							+ Join
						</button>
					</div>
					<div className="widget-content">
						{groups.length > 0 ? (
							<ul className="groups-list">
								{groups.map((group) => (
									<li
										key={group.id}
										className="group-item"
										onClick={() => openGroupDetails(group)}
									>
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
								You haven't joined any groups yet
							</p>
						)}					</div>
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
					groups={groups}
					onChangeChat={(group) => {
						setActiveChatId(group.name);
						setActiveChatGroup(group);
					}}
				/>
			)}
		</div>
	);
}

export default YouthHome;
