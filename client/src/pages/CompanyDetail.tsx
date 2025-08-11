import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Sidebar from "../components/Sidebar";
import type { Company } from "../types/company";
import CompanyHeader from "../components/CompanyHeader";

const CompanyDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleCompanyUpdate = (updatedCompany: Company) => {
        setCompany(updatedCompany);
    };

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
                    credentials: "include",
                });

                if (response.ok) {
                    const companyData = await response.json();
                    setCompany(companyData);
                }
            } catch (error) {
                console.error("Error fetching company:", error);
            } 
        };

        if (id) {
            fetchCompany();
        }
    }, [id, API_BASE_URL]);

    if (!company) {
        return null;
    }

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 text-black">
                <CompanyHeader company={company} onCompanyUpdate={handleCompanyUpdate} />
            </div>
        </div>
    );
};

export default CompanyDetail;