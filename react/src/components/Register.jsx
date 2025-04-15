import { useState } from "react";
import "../design/LR.css";
import { supabase } from "../utils/supabase.js";

function Register({ onClose, onSwitchToLogin, onRegister }) {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
		agreeTerms: false,
		role: "", // Add role
	});
	const [errors, setErrors] = useState({});
	const [registerError, setRegisterError] = useState("");

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleRoleSelect = (role) => {
		setFormData({
			...formData,
			role,
		});
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.firstName) newErrors.firstName = "First name is required";
		if (!formData.lastName) newErrors.lastName = "Last name is required";

		if (!formData.email) newErrors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Email is invalid";

		if (!formData.password) newErrors.password = "Password is required";
		else if (formData.password.length < 6)
			newErrors.password = "Password must be at least 6 characters";

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (!formData.role) newErrors.role = "Please select a role";

		if (!formData.agreeTerms)
			newErrors.agreeTerms = "You must agree to the terms and conditions";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validate()) {
			const { data, error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: {
					data: {
						first_name: formData.firstName,
						last_name: formData.lastName,
						phone: formData.phone,
						role: formData.role, // Save role in metadata
					},
				},
			});
	
			if (error) {
				console.error("Error signing up:", error.message);
				setRegisterError("Registration failed: " + error.message);
			} else {
				// Fetch the user object after registration
				const { data: userData } = await supabase.auth.getUser();
				console.log("Registration successful:", userData);
				onRegister(userData.user); // Pass the user object, not just formData
			}
		}
	};

	return (
		<div className="auth-modal">
			<div className="auth-container">
				<button className="close-button" onClick={onClose}>
					×
				</button>
				<h2>Create an Account</h2>

				{registerError && (
					<div className="login-error-message">{registerError}</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="form-row">
						<div className="form-group">
							<label htmlFor="firstName">First Name</label>
							<input
								type="text"
								id="firstName"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								className={errors.firstName ? "error" : ""}
							/>
							{errors.firstName && (
								<div className="error-message">{errors.firstName}</div>
							)}
						</div>

						<div className="form-group">
							<label htmlFor="lastName">Last Name</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								className={errors.lastName ? "error" : ""}
							/>
							{errors.lastName && (
								<div className="error-message">{errors.lastName}</div>
							)}
						</div>
					</div>

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

					<div className="form-group">
						<label htmlFor="confirmPassword">Confirm Password</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className={errors.confirmPassword ? "error" : ""}
						/>
						{errors.confirmPassword && (
							<div className="error-message">{errors.confirmPassword}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="phone">Phone Number</label>
						<input
							type="phone"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className={errors.phone ? "error" : ""}
						/>
						{errors.phone && (
							<div className="error-message">{errors.phone}</div>
						)}
					</div>

					<div className="form-group">
						<label>Role</label>
						<div className="role-select-group">
							{["leader", "member", "parent", "youth"].map((role) => (
								<button
									type="button"
									key={role}
									className={`role-btn${formData.role === role ? " selected" : ""}`}
									onClick={() => handleRoleSelect(role)}
									aria-pressed={formData.role === role}
								>
									{role.charAt(0).toUpperCase() + role.slice(1)}
								</button>
							))}
						</div>
						{errors.role && (
							<div className="error-message">{errors.role}</div>
						)}
					</div>

					<div className="form-group checkbox-group">
						<input
							type="checkbox"
							id="agreeTerms"
							name="agreeTerms"
							checked={formData.agreeTerms}
							onChange={handleChange}
							className={errors.agreeTerms ? "error" : ""}
						/>
						<label htmlFor="agreeTerms">
							I agree to the <a href="#">Terms and Conditions</a>
						</label>
						{errors.agreeTerms && (
							<div className="error-message">{errors.agreeTerms}</div>
						)}
					</div>

					<button type="submit" className="auth-button">
						Sign Up
					</button>
				</form>

				<div className="auth-footer">
					<p>
						Already have an account?{" "}
						<button className="text-button" onClick={onSwitchToLogin}>
							Log In
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Register;
