import { useState } from "react";
import { useSearchParams } from "react-router";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TabBar from "../components/TabBar";

const Reminders = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "overdue";

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
    };

    return (
        <>
            <div className="bg-gray-50 flex">
                <Sidebar />
                <div className="flex-1">
                    <PageHeader
                        title="reminders"
                        searchValue={searchQuery}
                        searchPlaceholder="Search reminders..."
                        onSearchChange={() => {}} 
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