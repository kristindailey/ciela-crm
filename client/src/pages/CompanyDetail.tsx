import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import type { Company } from "../types/company";
import Sidebar from "../components/Sidebar";
import CompanyHeader from "../components/CompanyHeader";
import TabBar from "../components/TabBar";
import CompanyOverview from "../components/CompanyOverview";
import CompanyContacts from "../components/CompanyContacts";

const CompanyDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
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
            await fetch(`${API_BASE_URL}/companies/${id}`, {
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
            await fetch(`${API_BASE_URL}/companies/${id}`, {
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
            await fetch(`${API_BASE_URL}/companies/${id}`, {
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
            await fetch(`${API_BASE_URL}/companies/${id}`, {
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
            await fetch(`${API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ glassdoorRating: newRating }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save Glassdoor rating:", error);
        }
    };

    const handleSaveBlindRating = async (newRating: number) => {
        if (!company) return;

        setCompany((prev) => prev ? { 
            ...prev, 
            blindRating: newRating,
        } : null);

        try {
            await fetch(`${API_BASE_URL}/companies/${id}`, {
                method: "PATCH", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ blindRating: newRating }),
                credentials: "include",
            })
        } catch (error) {
            console.error("Failed to save Blind rating:", error);
        }
    };

    const handleSaveOfficePolicy = async (newPolicy: string) => {
        if (!company) return;

        setCompany((prev) => prev ? { 
            ...prev, 
            officePolicy: newPolicy as "REMOTE" | "HYBRID" | "IN_OFFICE",
        } : null);

        try {
            await fetch(`${API_BASE_URL}/companies/${id}`, {
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
            await fetch(`${API_BASE_URL}/companies/${id}`, {
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
            await fetch(`${API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: newNotes }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save company notes:", error);
        }
    };

    const handleSaveIconField = async (field: string, newValue: string) => {
        if (!company) return;

        setCompany((prev) => prev ? {...prev, [field]: newValue } : null);

        try {
            await fetch(`${API_BASE_URL}/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: newValue }),
                credentials: "include",
            });
        } catch (error) {
            console.error(`Failed to save ${field} URL:`, error);
        }
    };

    const handleDeleteCompany = async () => {
        if (!company) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete company.");
            }

            navigate("/companies");
        } catch (error) {
            console.error("Failed to delete company:", error);
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
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCompany();
        }
    }, [id, API_BASE_URL]);

    if (isLoading) {
        return (
            <div className="bg-gray-50 flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        Loading company...
                    </div>
                </div>
            </div>
        );
    }

    if (!company) return null;

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <CompanyHeader company={company} onCompanyUpdate={handleCompanyUpdate} onSaveField={handleSaveIconField}/>

                <TabBar
                    tabs={[
                        { value: "overview", label: "overview" },
                        { value: "contacts", label: "contacts" },
                    ]}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {activeTab === "overview" && (
                    <CompanyOverview
                        company={company}
                        onSaveDescription={handleSaveDescription}
                        onSaveHQLocation={handleSaveHQLocation}
                        onSaveEmployeeCount={handleSaveEmployeeCount}
                        onSaveDate={handleSaveDate}
                        onSaveLocalLocation={handleSaveLocalLocation}
                        onSaveGlassdoorRating={handleSaveGlassdoorRating}
                        onSaveBlindRating={handleSaveBlindRating}
                        onSaveOfficePolicy={handleSaveOfficePolicy}
                        onSaveTechStack={handleSaveTechStack}
                        onSaveCompanyNotes={handleSaveCompanyNotes}
                    />
                )}

                {activeTab === "contacts" && (
                    <CompanyContacts companyId={id!} />
                )}
            </div>
        </div>
    );
};

export default CompanyDetail;