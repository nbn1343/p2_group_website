import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();

	const handleLogin = () => {
		// Mock authentication
		navigate("/home");
	};

	return (
		<div>
			<h2>Login</h2>
			<input type="text" placeholder="Username" />
			<input type="password" placeholder="Password" />
			<button onClick={handleLogin}>Login</button>
			<p>
				Don't have an account?{" "}
				<button onClick={() => navigate("/register")}>Register</button>
			</p>
		</div>
	);
}

export default Login;
