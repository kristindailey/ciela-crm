import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import type { Interaction } from "../types/interaction";
import { useReminders } from "../context/RemindersContext";
import { usePagination } from "../hooks/usePagination";
import PageHeader from "../components/PageHeader";
import TabBar from "../components/TabBar";
import ReminderCard from "../components/ReminderCard";
import Pagination from "../components/Pagination";

const Reminders = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [reminders, setReminders] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
	const { refreshReminderCount } = useReminders();
    const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
    const activeTab = searchParams.get("tab") || "overdue";
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const today = new Date();
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

	const filteredReminders = useMemo(() => {
		if (searchQuery === "") {
			return reminders;
		}
		
		return reminders.filter((reminder) => {
			const searchLower = searchQuery.toLowerCase();
	
			return (
				reminder.contact?.firstName.toLowerCase().includes(searchLower) ||
				reminder.contact?.lastName.toLowerCase().includes(searchLower) ||
				reminder.contact?.company?.name.toLowerCase().includes(searchLower) ||
				reminder.contact?.company?.tier.toLowerCase().includes(searchLower) ||
				reminder.type.toLowerCase().includes(searchLower) ||
				reminder.subject?.toLowerCase().includes(searchLower) ||
				reminder.message.toLowerCase().includes(searchLower)
			);
		});
	}, [reminders, searchQuery]);

    const filterRemindersByTab = (remindersToFilter: Interaction[], tab: string) => {
		return remindersToFilter.filter((reminder) => {
			if (!reminder.followUpDate) return false;

			const followUpDate = new Date(reminder.followUpDate);
			const followUpDateUTC = Date.UTC(followUpDate.getUTCFullYear(), followUpDate.getUTCMonth(), followUpDate.getUTCDate());
			const diffTime = followUpDateUTC - todayUTC;
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			if (tab === "overdue") {
				return diffDays < 0;
			} else if (tab === "due today") {
				return diffDays === 0;
			} else if (tab === "upcoming") {
				return diffDays > 0 && diffDays <= 7;
			}

			return false;
		});
	};

	const displayReminders = useMemo(() => {
		return filterRemindersByTab(filteredReminders, activeTab);
	}, [filteredReminders, activeTab]);

	const { currentPage, setCurrentPage, totalPages, paginatedItems: paginatedReminders, handlePageChange } = usePagination<Interaction>({
		items: displayReminders,
		itemsPerPage: 6,
	});

    const handleSearchReminders = (value: string) => {
        setSearchQuery(value);
		setCurrentPage(1);
    };

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
		setCurrentPage(1);
    };

    const handleClearReminder = async (interactionId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/interactions/${interactionId}`, {
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

			await refreshReminderCount();

            const clearedReminder = reminders.find((reminder) => reminder.id === interactionId);
			
            if (clearedReminder?.contact) {
                navigate(`/contacts/${clearedReminder.contact.id}?openModal=true`);
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

			await refreshReminderCount();
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

    return (
        <>
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
				<div className="flex flex-col min-h-[calc(100vh-280px)]">
					<div className={`${paginatedReminders.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start" : ""} flex-grow`}>
						{paginatedReminders.map((reminder) => (
							<ReminderCard
								key={reminder.id}
								reminder={reminder}
								onClear={handleClearReminder}
								onSnooze={handleSnoozeReminder}
							/>
						))}

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

						{!isLoading && reminders.length > 0 && displayReminders.length === 0 && searchQuery && (
							<div className="text-center text-gray-500 mt-8">
								No reminders found matching your search.
							</div>
						)}
					</div>
				</div>

				<Pagination 
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			</div>
        </>
    );
};

export default Reminders;