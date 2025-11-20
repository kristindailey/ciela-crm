import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
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

    const handleSearchReminders = (value: string) => {
        setSearchQuery(value);
    };

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
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