import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { Company } from "../types/company";
import Sidebar from "../components/Sidebar";
import CompanyHeader from "../components/CompanyHeader";
import InfoPill from "../components/InfoPill";

const CompanyDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    };
    
    const handleCompanyUpdate = (updatedCompany: Company) => {
        setCompany(updatedCompany);
    };

    const handleSaveDescription = async (newDescription: string) => {
        if (!company) {
            return;
        }

        setCompany((prev) => prev ? { 
            ...prev, 
            description: newDescription,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: newDescription }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save description:", error);
        }
    };

    const handleSaveHQLocation = async (newHQLocation: string) => {
        if (!company) {
            return;
        }

        setCompany((prev) => prev ? { 
            ...prev, 
            hqLocation: newHQLocation,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hqLocation: newHQLocation }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save HQ location:", error);
        }
    };

    const handleSaveEmployeeCount = async (newEmployeeCount: number) => {
        if (!company) {
            return;
        }

        setCompany((prev) => prev ? { 
            ...prev, 
            employeeCount: newEmployeeCount
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeCount: newEmployeeCount }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save employee count:", error);
        }
    };

    const handleSaveDate = async (newDate: string) => {
        console.log("Date save not implemented yet:", newDate);
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
            <div className="flex-1">
                <CompanyHeader company={company} onCompanyUpdate={handleCompanyUpdate} />

                <div className="flex gap-5 px-5 mt-3">
                    <InfoPill 
                        label="Description"
                        value={company.description}
                        placeholder="No description specified"
                        onSave={(newValue) => handleSaveDescription(newValue)}
                    />
                    <InfoPill 
                        label="HQ Location"
                        value={company.hqLocation}
                        placeholder="No location specified"
                        onSave={(newValue) => handleSaveHQLocation(newValue)}
                    />
                    <InfoPill 
                        label="Employee Count"
                        value={company.employeeCount?.toString()}
                        placeholder="No employee count specified"
                        onSave={(newValue) => handleSaveEmployeeCount(parseInt(newValue, 10))}
                    />
                    <InfoPill 
                        label="Last Contacted"
                        value={company.updatedAt ? formatDate(company.updatedAt) : undefined}
                        placeholder="Never contacted"
                        onSave={(newValue) => handleSaveDate(newValue)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;