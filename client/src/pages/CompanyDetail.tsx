import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { Company } from "../types/company";
import Sidebar from "../components/Sidebar";
import CompanyHeader from "../components/CompanyHeader";
import InfoPill from "../components/InfoPill";
import NotesSection from "../components/NotesSection";
import OutreachHistory from "../components/OutreachHistory";

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

    const formatEmployeeCount = (count: number | null | undefined) => {
        if (!count) return;

        return count.toLocaleString();
    };

    const formatOfficePolicy = (policy: string | undefined) => {
        if (!policy) return undefined;
        const formatted = policy.toLowerCase().replace("_", "-");
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };
    
    const handleCompanyUpdate = (updatedCompany: Company) => {
        setCompany(updatedCompany);
    };

    const handleSaveDescription = async (newDescription: string) => {
        if (!company) return;

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
        if (!company) return;

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
        if (!company) return;

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

    const handleSaveLocalLocation = async (newLocalLocation: string) => {
        if (!company) return;

        setCompany((prev) => prev ? { 
            ...prev, 
            localLocation: newLocalLocation,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ localLocation: newLocalLocation }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save local location:", error);
        }
    };

    const handleSaveGlassdoorRating = async (newRating: number) => {
        if (!company) return;
        
        setCompany((prev) => prev ? { 
            ...prev, 
            glassdoorRating: newRating,
        } : null);

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ glassdoorRating: newRating }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save Glassdoor rating:", error);
        }
    };

    const handleSaveGlassdoorSweRating = async (newRating: number) => {
        if (!company) return;

        setCompany((prev) => prev ? { 
            ...prev, 
            glassdoorSweRating: newRating,
        } : null);

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ glassdoorSweRating: newRating }),
                credentials: "include",
            })
        } catch (error) {
            console.error("Failed to save Glassdoor SWE rating:", error);
        }
    };

    const handleSaveOfficePolicy = async (newPolicy: string) => {
        if (!company) return;

        setCompany((prev) => prev ? { 
            ...prev, 
            officePolicy: newPolicy as "REMOTE" | "HYBRID" | "IN_OFFICE",
        } : null);

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ officePolicy: newPolicy }),
                credentials: "include",
            });
        } catch (error) {
            console.log("Failed to save office policy:", error);
        }
    };

    const handleSaveTechStack = async (newTechStack: string) => {
        if (!company) return;

        setCompany((prev) => prev ? { 
            ...prev, 
            techStack: newTechStack,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ techStack: newTechStack }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save tech stack:", error);
        }
    };

    const handleSaveCompanyNotes = async (newNotes: string) => {
        if (!company) return;

        setCompany((prev) => prev ? { 
            ...prev, 
            notes: newNotes,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: newNotes }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save company notes:", error);
        }
    };

    const handleSaveSocialField = async (field: string, newValue: string) => {
        if (!company) return;

        setCompany((prev) => prev ? {...prev, [field]: newValue } : null);

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: newValue }),
                credentials: "include",
            });
        } catch (error) {
            console.error(`Failed to save ${field} URL:`, error);
        }
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

    if (!company) return null;

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <CompanyHeader company={company} onCompanyUpdate={handleCompanyUpdate} onSaveField={handleSaveSocialField}/>

                <div className="grid grid-cols-4 gap-4 px-5 mt-3">
                    <InfoPill 
                        label="Description"
                        value={company.description}
                        placeholder="Add description"
                        onSave={(newValue) => handleSaveDescription(newValue)}
                    />
                    <InfoPill 
                        label="HQ Location"
                        value={company.hqLocation}
                        placeholder="Add HQ location"
                        onSave={(newValue) => handleSaveHQLocation(newValue)}
                    />
                    <InfoPill 
                        label="Employee Count"
                        value={formatEmployeeCount(company.employeeCount)}
                        placeholder="Add employee count"
                        onSave={(newValue) => {
                            const cleanValue = newValue.replace(/,/g, "");
                            handleSaveEmployeeCount(parseInt(cleanValue, 10));
                        }}
                    />
                    <InfoPill 
                        label="Last Contacted"
                        value={company.updatedAt ? formatDate(company.updatedAt) : undefined}
                        placeholder="Not yet contacted"
                        onSave={(newValue) => handleSaveDate(newValue)}
                    />
                </div>

                <div className="grid grid-cols-4 gap-4 px-5 mt-5">
                    <div className="grid grid-cols-2 gap-5">
                        <InfoPill 
                            label="Glasdoor Rating"
                            value={company.glassdoorRating?.toString()}
                            placeholder="Add rating"
                            onSave={(newValue) => {
                                const rating = parseFloat(newValue);
                                if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                                    handleSaveGlassdoorRating(rating);
                                }
                            }}
                        />

                        <InfoPill
                            label="Glassdoor SWE Rating"
                            value={company.glassdoorSweRating?.toString()}
                            placeholder="Add rating"
                            onSave={(newValue) => {
                                const rating = parseFloat(newValue);
                                if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                                    handleSaveGlassdoorSweRating(rating);
                                }
                             }}
                        />
                    </div>

                        <InfoPill 
                            label="Office Policy"
                            value={formatOfficePolicy(company.officePolicy)}
                            placeholder="Add office policy"
                            dropdownOptions={["Remote", "Hybrid", "In-Office"]}
                            onSave={(newValue) => {
                                    const policyMap: Record<string, string> = {
                                        "Remote": "REMOTE",
                                        "Hybrid": "HYBRID",
                                        "In-Office": "IN_OFFICE",
                                    };
                                    handleSaveOfficePolicy(policyMap[newValue]);
                                }}
                        />

                        <InfoPill 
                            label="Local Location"
                            value={company.localLocation}
                            placeholder="Add local location"
                            onSave={(newValue) => handleSaveLocalLocation(newValue)}
                        />

                        <InfoPill 
                            label="Tech Stack"
                            value={company.techStack}
                            placeholder="Add tech stack"
                            onSave={(newValue) => handleSaveTechStack(newValue)}
                        />
                </div>

                <div className="grid grid-cols-4 gap-4 px-5 mt-5">
                    <div className="col-span-2">
                        <NotesSection 
                            label="Company Notes"
                            value={company.notes}
                            placeholder="Add company notes"
                            onSave={(newValue) => handleSaveCompanyNotes(newValue)}
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <OutreachHistory 
                            label="Outreach History"
                            placeholder="Add outreach history"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;