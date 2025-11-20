import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import type { Interaction } from "../types/interaction";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TabBar from "../components/TabBar";
import ReminderCard from "../components/ReminderCard";

const Reminders = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [reminders, setReminders] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "overdue";
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categorizeReminders = () => {
        const overdue: Interaction[] = [];
        const dueToday: Interaction[] = [];
        const upcoming: Interaction[] = [];

        reminders.forEach((reminder) => {
            if (!reminder.followUpDate) return;

            const followUpDate = new Date(reminder.followUpDate);
            followUpDate.setHours(0, 0, 0, 0);

            const diffTime = followUpDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                overdue.push(reminder);
            } else if (diffDays === 0) {
                dueToday.push(reminder);
            } else if (diffDays <= 7) {
                upcoming.push(reminder);
            }
        });

        return { overdue, dueToday, upcoming };
    };

    const handleSearchReminders = (value: string) => {
        setSearchQuery(value);
    };

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
    };

    const handleClearReminder = async (interactionId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/interactions${interactionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
					followUpDate: null 
				}),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to clear reminder.");
            }

            const clearedReminder = reminders.find((reminder) => reminder.id === interactionId);
            if (clearedReminder?.contact) {
                navigate(`/contacts/${clearedReminder.contact.id}`);
            }
        } catch (error) {
            console.error("Failed to clear reminder:", error);
        }
    };
    
    const handleSnoozeReminder = async (interactionId: string) => {
        try {
            const reminder = reminders.find((reminder) => reminder.id === interactionId);
            if (!reminder?.followUpDate) return;

            const currentFollowUpDate = new Date(reminder.followUpDate);
            const newFollowUpDate = new Date(currentFollowUpDate);
            newFollowUpDate.setDate(newFollowUpDate.getDate() + 1);

            const formattedDate = newFollowUpDate.toISOString().split("T")[0];

            const response = await fetch(`${API_BASE_URL}/interactions/${interactionId}`, {
            	method: "PATCH",
               	headers: { "Content-Type": "application/json" },
               	body: JSON.stringify({ 
                	followUpDate: formattedDate,
				}),
               	credentials: "include", 
            });

            if (!response.ok) {
                throw new Error("Failed to snooze reminder.");
            }

			const updatedReminder = await response.json();
			setReminders((prev) => (
				prev.map((reminder) => reminder.id === interactionId ? updatedReminder : reminder)
			));
        } catch (error) {
            console.error("Failed to snooze reminder:", error);
        }
    };

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/interactions`, {
                    credentials: "include", 
                });

                if (response.ok) {
                    const remindersData = await response.json();
                    setReminders(remindersData);
                }
            } catch (error) {
                console.error("Error fetching reminders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReminders();
    }, []);

	const { overdue, dueToday, upcoming } = categorizeReminders();

    return (
        <>
            <div className="bg-gray-50 flex">
                <Sidebar />
                <div className="flex-1">
                    <PageHeader
                        title="reminders"
                        searchValue={searchQuery}
                        searchPlaceholder="Search reminders..."
                        onSearchChange={handleSearchReminders} 
                    />

                    <TabBar
                        tabs={[
                            { value: "overdue", label: "overdue" },
                            { value: "due today", label: "due today" },
                            { value: "upcoming", label: "upcoming" },
                        ]}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
                            {activeTab === "overdue" && overdue.map((reminder) => (
                                <ReminderCard
                                    key={reminder.id}
                                    reminder={reminder}
                                    onClear={handleClearReminder}
                                    onSnooze={handleSnoozeReminder}
                                />
                            ))}

							{activeTab === "due today" && dueToday.map((reminder) => (
                                <ReminderCard
                                    key={reminder.id}
                                    reminder={reminder}
                                    onClear={handleClearReminder}
                                    onSnooze={handleSnoozeReminder}
                                />
                            ))}

							{activeTab === "upcoming" && upcoming.map((reminder) => (
                                <ReminderCard
                                    key={reminder.id}
                                    reminder={reminder}
                                    onClear={handleClearReminder}
                                    onSnooze={handleSnoozeReminder}
                                />
                            ))}
                        </div>

                        {isLoading && (
                            <div className="text-center text-gray-500 mt-8">
                                Loading reminders...
                            </div>
                        )}

                        {!isLoading && reminders.length === 0 && (
                            <div className="text-center text-gray-500 mt-8">
                                No reminders yet. Get started by adding follow-up dates to your interactions.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reminders;