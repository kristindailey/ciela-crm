import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import type { Application } from "../types/application";
import { usePagination } from "../hooks/usePagination";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";
import ApplicationCard from "../components/ApplicationCard";
import Pagination from "../components/Pagination";

const Applications = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTier, setActiveTier] = useState("TIER_1");
	const [isLoading, setIsLoading] = useState(true);
	const [applications, setApplications] = useState<Application[]>([]);
    const tiers = ["TIER_1", "TIER_2", "TIER_3", "BACKLOG", "ALL"];
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();

	const formatTier = (tier: string) => {
        return tier
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/^\w/, c => c.toUpperCase());
    };

	const filteredApplications = useMemo(() => {
        let filtered = applications;

        if (activeTier !== "ALL") {
            filtered = filtered.filter((application) => {
              return application.company.tier === activeTier;  
            });
        }

        if (searchQuery !== "") {
            filtered = filtered.filter((application) => {
				const searchLower = searchQuery.toLowerCase();

                return application.jobTitle?.toLowerCase().includes(searchLower) ||
					application.company.name.toLowerCase().includes(searchLower) || 
					formatTier(application.company.tier).toLowerCase().includes(searchLower) ||
					application.status.toLowerCase().includes(searchLower) ||
					application.notes?.toLowerCase().includes(searchLower);
            });
        }

        return filtered;
    }, [applications, searchQuery, activeTier]);

	const { currentPage, setCurrentPage, totalPages, paginatedItems: paginatedApplications, handlePageChange } = usePagination<Application>({
		items: filteredApplications,
		itemsPerPage: 6,
	});

	const handleAddApplication = () => {
        navigate("/applications/new");
    };

	const handleSearchApplications = (value: string) => {
		setSearchQuery(value);
		setCurrentPage(1);
	};

    const handleTierChange = (tier: string) => {
        setActiveTier(tier);
		setCurrentPage(1);
    };

	const handleDeleteApplication = async (applicationId: string) => {
		try {
			const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to delete application.");
			}
			
			setApplications((prevApplications) => 
				prevApplications.filter((application) => application.id !== applicationId)
			);
		} catch (error) {
			console.error("Error deleting application:", error);
		}
	};

	useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/applications`, {
                    credentials: "include", 
                });

                if (response.ok) {
                    const applicationsData = await response.json();
                    setApplications(applicationsData);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    return (
        <>
			<PageHeader 
            	title="applications"
            	searchValue={searchQuery}
            	searchPlaceholder="Search applications..."
            	onSearchChange={handleSearchApplications}
            	onAddClick={handleAddApplication}
            	onUploadClick={() => {}}
        	/>

        	<TierTabs 
            	tiers={tiers}
            	activeTier={activeTier}
            	onTierChange={handleTierChange}
        	/>

			<div className="p-6">
				<div className="flex flex-col min-h-[calc(100vh-210px)]">
					<div className={`${paginatedApplications.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start" : ""} flex-grow`}>
						{paginatedApplications.map((application) => (
							<ApplicationCard
								key={application.id}
								application={application}
								onDelete={() => handleDeleteApplication(application.id)}
							/>
						))}

						{isLoading && (
							<div className="text-center text-gray-500 mt-8">
								Loading reminders...
							</div>
						)}

						{!isLoading && applications.length === 0 && (
							<div className="text-center text-gray-500 mt-8">
								Ready to add your first application? Click the + button to get started.
							</div>
						)}

						{!isLoading && applications.length > 0 && filteredApplications.length === 0 && searchQuery && (
							<div className="text-center text-gray-500 mt-8">
								No applications found matching your search.
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

export default Applications;