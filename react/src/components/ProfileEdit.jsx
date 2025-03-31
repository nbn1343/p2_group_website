function ProfileEdit({ userData, onSave }) {
    const [name, setName] = useState(userData.user_metadata?.first_name || '');
    const [email, setEmail] = useState(userData.user_metadata?.email || '');

    return (
        <div className="profile-edit">
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button onClick={() => onSave(name, email)}>Save</button>
        </div>
    );
}

export default ProfileEdit;