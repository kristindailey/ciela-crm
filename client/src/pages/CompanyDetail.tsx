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
        if (!count) {
            return;
        }

        return count.toLocaleString();
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

    const handleSaveLocalLocation = async (newLocalLocation: string) => {
        if (!company) {
            return;
        }

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
        if (!company) {
            return;
        }
        
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
        if (!company) {
            return;
        }

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

    const handleSaveTechStack = async (newTechStack: string) => {
        if (!company) {
            return;
        }

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
        if (!company) {
            return;
        }

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

    if (!company) {
        return null;
    }

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <CompanyHeader company={company} onCompanyUpdate={handleCompanyUpdate} onSaveField={handleSaveSocialField}/>

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
                        value={formatEmployeeCount(company.employeeCount)}
                        placeholder="No employee count specified"
                        onSave={(newValue) => {
                            const cleanValue = newValue.replace(/,/g, "");
                            handleSaveEmployeeCount(parseInt(cleanValue, 10));
                        }}
                    />
                    <InfoPill 
                        label="Last Contacted"
                        value={company.updatedAt ? formatDate(company.updatedAt) : undefined}
                        placeholder="Never contacted"
                        onSave={(newValue) => handleSaveDate(newValue)}
                    />
                </div>

                <div className="flex gap-5 px-5 mt-3">
                    <div>
                        <InfoPill 
                            label="Glasdoor Rating"
                            value={company.glassdoorRating?.toString()}
                            placeholder="No rating"
                            size="small"
                            onSave={(newValue) => {
                                const rating = parseFloat(newValue);
                                if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                                    handleSaveGlassdoorRating(rating);
                                }
                            }}
                        />

                        <div className="mt-3">
                            <InfoPill
                                label="Glassdoor SWE Rating"
                                value={company.glassdoorSweRating?.toString()}
                                placeholder="No rating"
                                size="small"
                                onSave={(newValue) => {
                                    const rating = parseFloat(newValue);
                                    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                                        handleSaveGlassdoorSweRating(rating);
                                    }
                                }}
                            />
                        </div>

                        <div className="mt-3">
                            {/* <InfoPill 
                                label="Office Policy"
                                value={company.officePolicy}
                                // placeholder=""
                                // onSave={(newValue) => handleSaveTechStack(newValue)}
                            /> */}
                        </div>
                    </div>

                    <div>
                        <InfoPill 
                            label="Local Location"
                            value={company.localLocation}
                            placeholder="No local location specified"
                            onSave={(newValue) => handleSaveLocalLocation(newValue)}
                        />
                        <div className="mt-3">
                            <InfoPill 
                            label="Tech Stack"
                            value={company.techStack}
                            placeholder="No tech stack specified"
                            onSave={(newValue) => handleSaveTechStack(newValue)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <NotesSection 
                            label="Company Notes"
                            value={company.notes}
                            placeholder="Click to add company notes..."
                            onSave={(newValue) => handleSaveCompanyNotes(newValue)}
                        />
                        <OutreachHistory 
                            label="Outreach History"
                            placeholder="TODO: Make functional"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;