import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Papa from "papaparse";
import type { Company } from "../types/company";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";
import CompanyCard from "../components/CompanyCard";
import Pagination from "../components/Pagination";
import UploadModal from "../components/UploadModal";
import { usePagination } from "../hooks/usePagination";

const Companies = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState<Company[]>([]);
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

    const filteredCompanies = useMemo(() => {
        let filtered = companies;

        if (activeTier !== "ALL") {
            filtered = filtered.filter((company) => {
              return company.tier === activeTier;  
            });
        }

        if (searchQuery !== "") {
            filtered = filtered.filter((company) => {
                const normalizedTier = company.tier.toLowerCase().replace("_", " ");
                return company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    normalizedTier.includes(searchQuery.toLowerCase());
            });
        }

        return filtered;
    }, [companies, searchQuery, activeTier]);

    const { currentPage, setCurrentPage, totalPages, paginatedItems: paginatedCompanies, handlePageChange } = usePagination<Company>({
        items: filteredCompanies,
        itemsPerPage: 9,
    });

    const handleAddCompany = () => {
        navigate("/companies/new");
    };

    const handleSearchCompanies = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleUploadCompanies = () => {
        setUploadStatus(null);
        setIsModalOpen(true);
    };

    const handleDownloadTemplate = () => {
        const headers = [
            "companyName",
            "tier",
            "website",
            "hqLocation",
            "localLocation",
            "description",
        ];

        const guidanceRow = [
            "(Required)",
            '"(Required, Valid options: TIER_1, TIER_2, TIER_3, or BACKLOG)"',
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
        link.download = "companies_template.csv";
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
                            if (row.companyName?.includes("Required") || row.companyName.startsWith("(")) {
                                continue;
                            }

                            if (!row.companyName || !row.tier) {
                                errors++;
                                continue;
                            }

                            const validTiers = ["TIER_1", "TIER_2", "TIER_3", "BACKLOG"];
                            if (!validTiers.includes(row.tier)) {
                                errors++;
                                continue;
                            }
    
                            const isDuplicate = companies.some((company) => company.name.toLowerCase() === row.companyName.toLowerCase());
    
                            if (isDuplicate) {
                                skipped++;
                                continue;
                            }
    
                            const companyResponse = await fetch(`${API_BASE_URL}/companies`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({
                                    name: row.companyName,
                                    tier: row.tier,
                                    website: row.website || null,
                                    hqLocation: row.hqLocation || null,
                                    localLocation: row.localLocation || null,
                                    description: row.description || null,
                                }),
                            });
    
                            if (!companyResponse.ok) {
                                errors++;
                                continue;
                            }
    
                            const newCompany = await companyResponse.json();
                            setCompanies((prev) => [...prev, newCompany]);
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

    const handleTierChange = (tier: string) => {
        setActiveTier(tier);
        setCurrentPage(1);
    };

    const handleDeleteCompany = async (companyId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete company.");
            }

            setCompanies((prevCompanies) => 
                prevCompanies.filter((company) => company.id !== companyId)
            );
        } catch (error) {
            console.error("Failed to delete company:", error);
        }
    }; 

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/companies`, {
                    credentials: "include",
                });

                if (response.ok) {
                    const companiesData = await response.json();
                    setCompanies(companiesData);
                } 
            } catch (error) {
                console.error("Error fetching companies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    return (
        <>
            <PageHeader 
                title="companies"
                searchValue={searchQuery}
                searchPlaceholder="Search companies..."
                onSearchChange={handleSearchCompanies}
                onAddClick={handleAddCompany}
                onUploadClick={handleUploadCompanies}
            />

            <TierTabs 
                tiers={tiers}
                activeTier={activeTier}
                onTierChange={handleTierChange}
            />

            <div className="p-6">
				<div className="flex flex-col min-h-[calc(100vh-360px)]">
					<div className={`${paginatedCompanies.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start" : ""} flex-grow`}>
						{paginatedCompanies.map((company) => (
							<CompanyCard 
								key={company.id} 
								company={company} 
								onDelete={() => handleDeleteCompany(company.id)}
							/>
						))}

						{isLoading && (
							<div className="text-center text-gray-500 mt-8">
								Loading companies...
							</div>
                		)}

						{!isLoading && companies.length === 0 && (
							<div className="text-center text-gray-500 mt-8">
								Ready to add your first company? Click the + button to get started.
							</div>
						)}

						{!isLoading && companies.length > 0 && filteredCompanies.length === 0 && searchQuery && (
							<div className="text-center text-gray-500 mt-8">
								No companies found matching your search.
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
                uploadType="Companies"
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

export default Companies;