import React from "react";
import { useNavigate } from "react-router-dom";

function Register() {
	const navigate = useNavigate();

	const handleRegister = () => {
		// Mock registration
		navigate("/home");
	};

	return (
		<div>
			<h2>Register</h2>
			<input type="text" placeholder="Username" />
			<input type="password" placeholder="Password" />
			<button onClick={handleRegister}>Register</button>
			<p>
				Already have an account?{" "}
				<button onClick={() => navigate("/")}>Login</button>
			</p>
		</div>
	);
}

export default Register;
