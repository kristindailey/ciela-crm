import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import type { Company } from "../types/company";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";
import CompanyCard from "../components/CompanyCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";

const Companies = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [activeTier, setActiveTier] = useState("TIER_1");
    const itemsPerPage = 9;
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
        itemsPerPage,
    });

    const handleAddCompany = () => {
        navigate("/companies/new");
    };

    const handleSearchCompanies = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleTierChange = (tier: string) => {
        setActiveTier(tier);
        setCurrentPage(1);
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
            }
        };

        fetchCompanies();
    }, []);

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <PageHeader 
                    title="companies"
                    searchValue={searchQuery}
                    searchPlaceholder="Search companies..."
                    onSearchChange={handleSearchCompanies}
                    onAddClick={handleAddCompany}
                />

                <TierTabs 
                    tiers={tiers}
                    activeTier={activeTier}
                    onTierChange={handleTierChange}
                />

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:min-h-[490px] content-start">
                        {paginatedCompanies.map((company) => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />

                    {filteredCompanies.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            {searchQuery ? "No companies found matching your search." : "Ready to add your first company? Click the + button to get started."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Companies;