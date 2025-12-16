import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import Papa from "papaparse";
import type { Application } from "../types/application";
import { usePagination } from "../hooks/usePagination";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";
import ApplicationCard from "../components/ApplicationCard";
import Pagination from "../components/Pagination";
import UploadModal from "../components/UploadModal";

const Applications = () => {
    const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [applications, setApplications] = useState<Application[]>([]);
    const [activeTier, setActiveTier] = useState("TIER_1");
	const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{
        isProcessing: boolean;
        imported: number;
        skipped: number;
        errors: number;
    } | null>(null);
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

	const handleUpdateApplication = (updatedApplication: Application) => {
		setApplications((prevApplications) => 
			prevApplications.map((application) => 
				application.id === updatedApplication.id ? updatedApplication : application
			)
		);
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

	const handleUploadApplications = () => {
        setUploadStatus(null);
        setIsModalOpen(true);
    };

	const handleDownloadTemplate = () => {
        const headers = [
            "jobTitle",
			"companyName",
			"status",
			"appliedDate",
			"resumeUrl",
			"coverLetterUrl",
			"projectDocsUrl",
			"notes",
        ];

        const guidanceRow = [
            "(Required)",
            "(Required)",
            '"(Valid options: APPLIED, PHONE_SCREEN, TECHNICAL, ONSITE, OFFER, REJECTED, or WITHDRAWN)"',
            "",
            "",
            "",
            "",
            "",
        ];

        const csvContent = headers.join(",") + "\n" + guidanceRow.join(",");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "applications_template.csv";
        link.click();
        window.URL.revokeObjectURL(url);
    };

	const handleUploadCSV = async (file: File) => {
		setUploadStatus({ isProcessing: true, imported: 0, skipped: 0, errors: 0 });
	
		try {
			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				complete: async (results) => {
					const rows = results.data as any[];
					let imported = 0;
					let skipped = 0;
					let errors = 0;
	
					for (const row of rows) {
						try {
							if (row.jobTite?.includes("Required") || row.jobTitle?.startsWith("(")) {
								continue;
							}
	
							if (!row.jobTitle || !row.companyName) {
								errors++;
								continue;
							}
	
							const isDuplicate = applications.some(
								(application) =>
									application.jobTitle?.toLowerCase() === row.jobTitle.toLowerCase() &&
									application.company.name.toLowerCase() === row.companyName.toLowerCase()
							);
	
							if (isDuplicate) {
								skipped++;
								continue;
							}
	
							const companyResponse = await fetch(`${API_BASE_URL}/companies/upload`, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								credentials: "include",
								body: JSON.stringify({
									name: row.companyName,
									tier: "BACKLOG",
								}),
							});
	
							if (!companyResponse.ok) {
								errors++;
								continue;
							}
	
							const company = await companyResponse.json();
	
							const applicationResponse = await fetch(`${API_BASE_URL}/applications`, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								credentials: "include",
								body: JSON.stringify({
									jobTitle: row.jobTitle,
									companyId: company.id,
									status: row.status || "APPLIED",
									appliedDate: row.appliedDate ? new Date(row.appliedDate) : new Date(),
									resumeUrl: row.resumeUrl || null,
									coverLetterUrl: row.coverLetterUrl || null,
									projectDocsUrl: row.projectDocsUrl || null,
									notes: row.notes || null,
								}),
							});
	
							if (!applicationResponse.ok) {
								errors++;
								continue;
							}
	
							const newApplication = await applicationResponse.json();
							setApplications((prev) => [...prev, newApplication]);
	
							imported++;
						} catch (error) {
							errors++;
						}
					}
	
					setUploadStatus({ isProcessing: false, imported, skipped, errors });
				},
				error: (error) => {
					console.error("Parse error:", error);
					setUploadStatus({ isProcessing: false, imported: 0, skipped: 0, errors: 1 });
				},
			});
		} catch (error) {
			console.error("Failed to upload CSV:", error);
			setUploadStatus({ isProcessing: false, imported: 0, skipped: 0, errors: 1 });
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
            	onUploadClick={handleUploadApplications}
        	/>

        	<TierTabs 
            	tiers={tiers}
            	activeTier={activeTier}
            	onTierChange={handleTierChange}
        	/>

			<div className="p-6">
				<div className="flex flex-col min-h-[calc(100vh-150px)]">
					<div className={`${paginatedApplications.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start" : ""} flex-grow`}>
						{paginatedApplications.map((application) => (
							<ApplicationCard
								key={application.id}
								application={application}
								onUpdateApplication={handleUpdateApplication}
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

			<UploadModal
                isOpen={isModalOpen}
                uploadType="Applications"
                onClose={() => {
                    setIsModalOpen(false);
                    setUploadStatus(null);
                }}
                onDownloadTemplate={handleDownloadTemplate}
                onUpload={handleUploadCSV}
                uploadStatus={uploadStatus}
            />
        </>
    );
};

export default Applications;