// ProfilePage.jsx
import React, { useState } from 'react';

function ProfilePage({ userData, onUpdateUser }) {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);

  const handleSave = () => {
    // Here you would typically make an API call to update the user details
    onUpdateUser({ ...userData, name, email });
  };

  return (
    <div className="profile-page">
      <h1>Edit Profile</h1>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default ProfilePage;
