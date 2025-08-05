import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Company } from "../types/company";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import CompanyCard from "../components/CompanyCard";

const Companies = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    const handleAddCompany = () => {
        navigate("/companies/new");
    };

    const handleSearchCompanies = (value: string) => {
        setSearchQuery(value);
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
        if (searchQuery === "") {
            setFilteredCompanies(companies);
        } else {
            const filtered = companies.filter((company) => {
                return company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                company.description?.toLowerCase().includes(searchQuery.toLowerCase())
            });
                
            setFilteredCompanies(filtered);
        }
    }, [companies, searchQuery]);

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