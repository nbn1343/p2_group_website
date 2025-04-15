import { useState, useEffect } from "react";
import "../design/Home.css";
import Reminders from "../modal/Reminders";
import Calendar from "../modal/Calendar";
import GroupModal from "../modal/GroupModal";
import ChatModal from "../modal/ChatModal";
import { supabase } from "../utils/supabase";

function ParentHome({ userData, onLogout, children }) {
	// User info
	const firstName = userData?.user_metadata?.first_name || "User";

	// --- CHILDREN FILTER STATE ---
	const [selectedChildId, setSelectedChildId] = useState(children?.[0]?.id || null);
	const selectedChild = children?.find(child => child.id === selectedChildId);

	// Reminders
	const [showAddReminderForm, setShowAddReminderForm] = useState(false);

	// Mock data for groups
	const [groups, setGroups] = useState([
		{ id: 1, name: "Youth Ministry", members: 24, role: "Member", description: "Weekly activities and events for our church youth.", meetingTime: "Sundays at 4 PM", location: "Fellowship Hall" },
		{ id: 2, name: "Worship Team", members: 12, role: "Leader", description: "Music ministry team for Sunday services and special events.", meetingTime: "Thursdays at 7 PM", location: "Sanctuary" },
		{ id: 3, name: "Bible Study", members: 18, role: "Member", description: "Weekly Bible study focusing on different books and themes.", meetingTime: "Wednesdays at 6:30 PM", location: "Room 201" },
		{ id: 4, name: "Outreach Committee", members: 8, role: "Member", description: "Planning and coordinating community outreach events.", meetingTime: "First Monday of month at 6 PM", location: "Conference Room" },
	]);

	// Chat state
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [activeChatId, setActiveChatId] = useState(null);

	// Group modal states
	const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [joinCode, setJoinCode] = useState("");
	const [joinError, setJoinError] = useState("");

	// Profile edit states
	const [editProfile, setEditProfile] = useState(false);
	const [name, setName] = useState(userData.user_metadata?.first_name || '');
	const [email, setEmail] = useState(userData.user_metadata?.email || '');
	const [phone, setPhone] = useState(userData.user_metadata?.phone || '');
	const [role, setRole] = useState(userData.user_metadata?.role || '');
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
				location: "Prayer Room"
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

	// Open chat with specific person/group
	const openChat = (chatId) => {
		setActiveChatId(chatId);
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
					{/* --- CHILDREN FILTER DROPDOWN --- */}
					{children && children.length > 0 && (
						<select
							className="child-filter-dropdown"
							value={selectedChildId}
							onChange={e => setSelectedChildId(Number(e.target.value))}
							style={{
								background: "var(--widget-bg)",
								color: "var(--teal)",
								border: "1px solid var(--teal)",
								borderRadius: "4px",
								padding: "0.3em 0.8em",
								marginRight: "1rem"
							}}
						>
							{children.map(child => (
								<option key={child.id} value={child.id}>
									{child.name}
								</option>
							))}
						</select>
					)}
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
					<Calendar userData={userData} child={selectedChild} />
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
							child={selectedChild}
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
			{/* Group Modal */}
			{showJoinGroupModal && (
				<GroupModal
					onClose={() => setShowJoinGroupModal(false)}
					selectedGroup={selectedGroup}
					joinCode={joinCode}
					setJoinCode={setJoinCode}
					joinError={joinError}
					onJoinGroup={handleJoinGroup}
				/>
			)}

			{/* Chat Icon */}
			<div className="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
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
					activeChatId={activeChatId}
				/>
			)}
		</div>
	);
}

export default ParentHome;
