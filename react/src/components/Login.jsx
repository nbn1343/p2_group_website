import { useState } from "react";
import "../design/LR.css";
import { supabase } from "../utils/supabase.js";

function Login({ onClose, onSwitchToRegister, onLogin }) {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.email) newErrors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Email is invalid";

		if (!formData.password) newErrors.password = "Password is required";
		else if (formData.password.length < 6)
			newErrors.password = "Password must be at least 6 characters";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validate()) {
			// Call Supabase sign-in method
			const { data, error } = await supabase.auth.signInWithPassword({
				email: formData.email,
				password: formData.password,
			});
			if (error) {
				console.error("Error logging in:", error.message);
				// Handle the error (display a message to the user, etc.)
			} else {
				console.log("Login successful:", data);
				onLogin(formData);
			}
		}
	};

	return (
		<div className="auth-modal">
			<div className="auth-container">
				<button className="close-button" onClick={onClose}>
					×
				</button>
				<h2>Log In to Faith Connect</h2>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className={errors.email ? "error" : ""}
						/>
						{errors.email && (
							<div className="error-message">{errors.email}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className={errors.password ? "error" : ""}
						/>
						{errors.password && (
							<div className="error-message">{errors.password}</div>
						)}
					</div>

					<div className="form-group checkbox-group">
						<input
							type="checkbox"
							id="rememberMe"
							name="rememberMe"
							checked={formData.rememberMe}
							onChange={handleChange}
						/>
						<label htmlFor="rememberMe">Remember me</label>
					</div>

					<button type="submit" className="auth-button">
						Log In
					</button>
				</form>

				<div className="auth-footer">
					<p>
						Don't have an account?{" "}
						<button className="text-button" onClick={onSwitchToRegister}>
							Sign Up
						</button>
					</p>
					<p>
						<a href="#">Forgot Password?</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
