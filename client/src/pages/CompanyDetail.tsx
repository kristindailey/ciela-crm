import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Sidebar from "../components/Sidebar";
import type { Company } from "../types/company";

const CompanyDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null)
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompany();
        }
    }, [id, API_BASE_URL]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!company) {
        return <div>Company not found.</div>;
    }

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
                    <pre>{JSON.stringify(company, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;