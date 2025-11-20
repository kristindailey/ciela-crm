import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import type { Interaction } from "../types/interaction";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TabBar from "../components/TabBar";

const Reminders = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [reminders, setReminders] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "overdue";
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const handleSearchReminders = (value: string) => {
        setSearchQuery(value);
    };

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
    };

    const handleClear = async (interactionId: string, contactId: string) => {
        try {
            await fetch(`${API_BASE_URL}/interactions${interactionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ followUpDate: null }),
                credentials: "include",
            });

            navigate(`/contacts/${contactId}`);
        } catch (error) {
            console.error("Error clearing reminder:", error);
        }
    };
    
    const handleSnooze = async (interactionId: string) => {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split("T")[0];

            await fetch(`${API_BASE_URL}/interactions/${interactionId}`, {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ followUpDate: tomorrowStr }),
               credentials: "include", 
            });
        } catch (error) {
            console.error("Error snoozing reminder:", error);
        }
    };

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/interactions?reminders=true&urgency=${activeTab}`, {
                    credentials: "include", 
                });

                if (response.ok) {
                    const data = await response.json();
                    setReminders(data);
                }
            } catch (error) {
                console.error("Error fetching reminders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReminders();
    }, [activeTab]);

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
                </div>
            </div>
        </>
    );
};

export default Reminders;