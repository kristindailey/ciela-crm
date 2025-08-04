import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import type { Company } from "../types/company";

const AddContactPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        notes: "",
    });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [showNewCompany, setShowNewCompany] = useState(false);
    const [newCompanyData, setNewCompanyData] = useState({
        name: "",
        website: "",
        description: "",
    });
    const [error, setError] = useState<string>("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCompanySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "create-new") {
            setShowNewCompany(true);
            setSelectedCompany("");
        } else {
            setShowNewCompany(false);
            setSelectedCompany(value);
        }
    };

    const handleNewCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCompanyData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "name" && error) {
            setError("");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try { 
            let companyId = selectedCompany;

            if (showNewCompany) {
                const existingCompany = companies.find((c) => {
                    return c.name.toLowerCase() === newCompanyData.name.toLowerCase();
                });

                if (existingCompany) {
                    setError("Company already exists! Please select it from the dropdown.");
                    return;
                }

                setError("");

                const companyResponse = await fetch(`${API_BASE_URL}/companies`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCompanyData),
                    credentials: "include",
                });

                const newCompany = await companyResponse.json();
                companyId = newCompany.id;
            }

            const contactResponse = await fetch(`${API_BASE_URL}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    companyId,
                }),
                credentials: "include",
            });

            const newContact = await contactResponse.json();
            // navigate(`/contacts/${newContact.id}`);
            navigate(`/contacts`);
        } catch (error) {
            console.error("Error creating contact:", error);
        }
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
                <div className="p-6 text-black">
                    <h1 className="text-2xl font-bold mb-4">Add New Contact</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    <form className="space-y-4" onSubmit={handleSave}>
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                            <input 
                                type="text" 
                                id="firstName"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                            <input 
                                type="text" 
                                id="lastName"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                            <input 
                                type="text" 
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
                            <textarea 
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                            <select 
                                name="company" 
                                id="company"
                                value={selectedCompany}
                                onChange={handleCompanySelect}
                                required={!showNewCompany}
                                className="px-4 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                            >    
                                <option value="">Choose a company...</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                                
                                <option value="create-new">Create New Company</option>
                            </select>
                            {showNewCompany && (
                                <div className="mt-4 p-4 border border-2 border-[var(--royal-blue)] rounded-md">
                                    <h3 className="text-lg font-medium mb-4">New Company Details</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
                                            <input 
                                                type="text" 
                                                id="companyName"
                                                name="name"
                                                required
                                                value={newCompanyData.name}
                                                onChange={handleNewCompanyChange}
                                                className="px-4 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="companyWebsite" className="block text-sm font-medium mb-1">Company Website</label>
                                            <input 
                                                type="text" 
                                                id="companyWebsite"
                                                name="website"
                                                required
                                                value={newCompanyData.website}
                                                onChange={handleNewCompanyChange}
                                                className="px-4 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-[var(--royal-blue)] text-white rounded-md hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] hover:font-medium"
                        >
                            Create Contact
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddContactPage;