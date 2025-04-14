// Reminders.jsx
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

function Reminders({ showAddForm, onCloseAddReminder, userData }) {
	const [reminders, setReminders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [validationError, setValidationError] = useState("");
	const [supabaseError, setSupabaseError] = useState("");

	// State to control whether completed reminders are shown
	const [showCompleted, setShowCompleted] = useState(false);

	// States for the new reminder form
	const [newReminderText, setNewReminderText] = useState("");
	const [newReminderDueDate, setNewReminderDueDate] = useState("");

	// Fetch reminders for the current user
	const fetchReminders = async () => {
		if (!userData || !userData.id) {
			setLoading(false);
			return;
		  }
		  
		setLoading(true);
		setSupabaseError("");
		const { data, error } = await supabase
			.from("reminders")
			.select("*")
			.eq("user_id", userData.id) // filter by current user's id
			.order("due_date", { ascending: true });
		if (error) {
			setSupabaseError(error.message);
		} else {
			setReminders(data);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (userData) {
			fetchReminders();
		}
	}, [userData]);

	// Add a new reminder
	const addReminder = async (e) => {
		e.preventDefault();
		if (!newReminderText || !newReminderDueDate) {
			setValidationError("Please enter a reminder and due date.");
			return;
		}
		setValidationError("");
		setSupabaseError("");
		const { error } = await supabase.from("reminders").insert([
			{
				text: newReminderText,
				due_date: newReminderDueDate,
				completed: false,
				user_id: userData.id,
			},
		]);
		if (error) {
			setSupabaseError(error.message);
		} else {
			setNewReminderText("");
			setNewReminderDueDate("");
			await fetchReminders();
			onCloseAddReminder();
		}
	};

	// Toggle the completed status
	const toggleComplete = async (reminder) => {
		setSupabaseError("");
		const { error } = await supabase
			.from("reminders")
			.update({ completed: !reminder.completed })
			.eq("id", reminder.id);
		if (error) {
			setSupabaseError(error.message);
		} else {
			fetchReminders();
		}
	};

	// Delete a reminder
	const deleteReminder = async (id) => {
		setSupabaseError("");
		const { error } = await supabase.from("reminders").delete().eq("id", id);
		if (error) {
			setSupabaseError(error.message);
		} else {
			fetchReminders();
		}
	};

	// Update reminder text (inline editing)
	const updateReminderText = async (reminder, newText) => {
		setSupabaseError("");
		const { error } = await supabase
			.from("reminders")
			.update({ text: newText })
			.eq("id", reminder.id);
		if (error) {
			setSupabaseError(error.message);
		} else {
			fetchReminders();
		}
	};

	if (loading) return <div>Loading reminders...</div>;

	// Separate reminders into incomplete and completed arrays
	const incompleteReminders = reminders.filter((r) => !r.completed);
	const completedReminders = reminders.filter((r) => r.completed);

	return (
		<div>
			{/* ───── ADD REMINDER MODAL ───── */}
			{showAddForm && (
				<div className="reminder-modal">
					<div className="reminder-container">
						<button className="close-button" onClick={onCloseAddReminder}>
							×
						</button>
						<h2>Add Reminder</h2>
						{validationError && (
							<div style={{ color: "red", marginBottom: "1rem" }}>
								{validationError}
							</div>
						)}
						<form onSubmit={addReminder} className="add-reminder-form">
							<input
								type="text"
								placeholder="Reminder"
								value={newReminderText}
								onChange={(e) => setNewReminderText(e.target.value)}
							/>
							<input
								type="date"
								value={newReminderDueDate}
								onChange={(e) => setNewReminderDueDate(e.target.value)}
							/>
							<button
								type="submit"
								disabled={!newReminderText || !newReminderDueDate}
							>
								Add Reminder
							</button>
						</form>
					</div>
				</div>
			)}

			{/* ───── SUPABASE ERROR ───── */}
			{supabaseError && (
				<div style={{ color: "red", margin: "1rem" }}>
					Error: {supabaseError}
				</div>
			)}

			{/* ───── Incomplete Reminders ───── */}
			{incompleteReminders.length === 0 ? (
				<p className="no-data-message">Add a reminder</p>
			) : (
				<ul className="reminders-list">
					{incompleteReminders.map((reminder) => (
						<li
							key={reminder.id}
							className={`reminder-item ${
								reminder.completed ? "completed" : ""
							}`}
						>
							<input
								type="checkbox"
								checked={reminder.completed}
								onChange={() => toggleComplete(reminder)}
							/>
							<div className="reminder-details">
								<input
									type="text"
									value={reminder.text}
									onChange={(e) => updateReminderText(reminder, e.target.value)}
									className="reminder-text-input"
								/>
								<p>Due: {new Date(reminder.due_date).toLocaleDateString()}</p>
							</div>
							<button onClick={() => deleteReminder(reminder.id)}>
								Delete
							</button>
						</li>
					))}
				</ul>
			)}

			{/* ───── Completed Reminders (Collapsible) ───── */}
			<div className="completed-section" style={{ marginTop: "1rem" }}>
				<button
					className="toggle-completed-btn"
					onClick={() => setShowCompleted(!showCompleted)}
					style={{
						background: "none",
						border: "none",
						color: "var(--teal)",
						fontSize: "1rem",
						cursor: "pointer",
					}}
				>
					{showCompleted ? "Hide" : "Show"} Completed Reminders
				</button>
				{showCompleted && completedReminders.length > 0 && (
					<ul
						className="reminders-list completed"
						style={{ marginTop: "0.5rem" }}
					>
						{completedReminders.map((reminder) => (
							<li
								key={reminder.id}
								className={`reminder-item ${
									reminder.completed ? "completed" : ""
								}`}
							>
								<input
									type="checkbox"
									checked={reminder.completed}
									onChange={() => toggleComplete(reminder)}
								/>
								<div className="reminder-details">
									<input
										type="text"
										value={reminder.text}
										onChange={(e) =>
											updateReminderText(reminder, e.target.value)
										}
										className="reminder-text-input"
									/>
									<p>Due: {new Date(reminder.due_date).toLocaleDateString()}</p>
								</div>
								<button onClick={() => deleteReminder(reminder.id)}>
									Delete
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default Reminders;
