import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Company } from "../types/company";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";
import CompanyCard from "../components/CompanyCard";

const Companies = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [activeTier, setActiveTier] = useState("TIER_1");
    const tiers = ["TIER_1", "TIER_2", "TIER_3", "BACKLOG", "ALL"];
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    const handleAddCompany = () => {
        navigate("/companies/new");
    };

    const handleSearchCompanies = (value: string) => {
        setSearchQuery(value);
    };

    const handleTierChange = (tier: string) => {
        setActiveTier(tier);
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

    useEffect(() => {
        let filtered = companies;

        if (activeTier !== "ALL") {
            filtered = filtered.filter((company) => {
              return company.tier === activeTier;  
            });
        }

        if (searchQuery !== "") {
            filtered.filter((company) => {
                return company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    company.description?.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }
        
        setFilteredCompanies(filtered);
    }, [companies, searchQuery, activeTier]);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCompanies.map((company) => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Companies;