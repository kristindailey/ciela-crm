import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface RemindersContextType {
	reminderCount: number;
	refreshReminderCount: () => Promise<void>;
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const RemindersProvider = ({ children }: { children: ReactNode }) => {
	const [reminderCount, setReminderCount] = useState(0);
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const refreshReminderCount = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/interactions`, {
				credentials: "include",
			});

			if (response.ok) {
				const reminders = await response.json();
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				const activeCount = reminders.filter((reminder: any) => {
					if (!reminder.followUpDate) return false;

					const followUpDate = new Date(reminder.followUpDate);
					followUpDate.setHours(0, 0, 0, 0);

					return followUpDate.getTime() <= today.getTime();
				}).length;

				setReminderCount(activeCount);
			}
		} catch (error) {
			console.error("Error fetching reminder count:", error);
		}
	};

	useEffect(() => {
		refreshReminderCount();
	}, []);

	return (
		<RemindersContext.Provider value={{ reminderCount, refreshReminderCount }}>
			{children}
		</RemindersContext.Provider>
	);
};

export const useReminders = () => {
	const context = useContext(RemindersContext);

	if (!context) {
		throw new Error("useReminders must be used within RemindersProvider.");
	}

	return context;
};