import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Company } from "../types/company";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";

const Companies = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, _setCompanies] = useState<Company[]>([]);
    const [_filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

    const navigate = useNavigate();

    const handleAddCompany = () => {
        navigate("/companies/new");
    };

    const handleSearchCompanies = (value: string) => {
        setSearchQuery(value);
    };

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredCompanies(companies);
        } else {
            const filtered = companies.filter((company) => {
                company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            </div>
        </div>
    );
};

export default Companies;