import React from "react";

function GroupModal({ 
    onClose, 
    selectedGroup, 
    joinCode, 
    setJoinCode, 
    joinError, 
    onJoinGroup 
}) {
    // If selectedGroup exists, we show the group details view
    // Otherwise, we show the join group form
    return (
        <div className="group-modal">
            <div className="group-container">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                
                {selectedGroup ? (
                    // Group details view
                    <div className="group-details-view">
                        <div className="group-header">
                            <div className="group-icon large">{selectedGroup.name.charAt(0)}</div>
                            <h2>{selectedGroup.name}</h2>
                        </div>
                        
                        <div className="group-stats">
                            <div className="stat-item">
                                <span className="stat-value">{selectedGroup.members}</span>
                                <span className="stat-label">Members</span>
                            </div>
                            <div className="stat-item">
                                <span className="role-badge large">{selectedGroup.role}</span>
                                <span className="stat-label">Your Role</span>
                            </div>
                        </div>
                        
                        <div className="group-section">
                            <h3>About</h3>
                            <p>{selectedGroup.description}</p>
                        </div>
                        
                        <div className="group-section">
                            <h3>Meeting Information</h3>
                            <div className="meeting-info">
                                <div className="info-item">
                                    <span className="info-label">Time:</span>
                                    <span className="info-value">{selectedGroup.meetingTime}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Location:</span>
                                    <span className="info-value">{selectedGroup.location}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group-actions">
                            <button className="primary-btn">Message Group</button>
                            <button className="secondary-btn">View Calendar</button>
                        </div>
                    </div>
                ) : (
                    // Join group form
                    <div className="join-group-view">
                        <h2>Join a Group</h2>
                        <p className="join-instructions">
                            Enter the group code provided by your group leader to join a new group.
                        </p>
                        
                        {joinError && <div className="error-message">{joinError}</div>}
                        
                        <input
                            type="text"
                            placeholder="Enter group code (try DEMO123)"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="group-code-input"
                        />
                        
                        <button 
                            className="primary-btn"
                            onClick={onJoinGroup}
                        >
                            Join Group
                        </button>
                        
                        <div className="group-help">
                            <p>Don't have a code? Contact your group leader or church admin.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GroupModal;