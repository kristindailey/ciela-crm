import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Company } from "../types/company";
import { normalizeUrl } from "../utils/urlHelpers";

const AddContactPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        role: "",
        location: "",
        email: "",
        bluesky: "",
        github: "",
        linkedin: "",
        website: "",
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCompanySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        if (value === "create-new") {
            setShowNewCompany(true);
            setSelectedCompany("");
        } else {
            setShowNewCompany(false);
            setSelectedCompany(value);
        }
    };

    const handleNewCompanyChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setNewCompanyData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "name" && error) {
            setError("");
        }
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

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
                    body: JSON.stringify({
                        ...newCompanyData,
                        website: normalizeUrl(newCompanyData.website),
                    }),
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
                    website: normalizeUrl(formData.website),
                    linkedin: normalizeUrl(formData.linkedin),
                    bluesky: normalizeUrl(formData.bluesky),
                    github: normalizeUrl(formData.github),
                }),
                credentials: "include",
            });

            const newContact = await contactResponse.json();
            navigate(`/contacts/${newContact.id}`);
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
        <div className="p-6 text-primary">
            <h1 className="text-2xl font-bold mt-20 mb-4">Add New Contact</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSave}>
                <div className="flex gap-5 mt-5">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
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
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
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
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
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
                            <div className="mt-4 p-4 border border-2 border-[var(--card-border)] rounded-md">
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
                                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
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
                                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-5 mt-8">
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>
                </div>

                <div className="flex gap-5 mt-8">
                    <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium mb-1">LinkedIn</label>
                        <input
                            type="text"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="bluesky" className="block text-sm font-medium mb-1">Bluesky</label>
                        <input
                            type="text"
                            id="bluesky"
                            name="bluesky"
                            value={formData.bluesky}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="github" className="block text-sm font-medium mb-1">GitHub</label>
                        <input
                            type="text"
                            id="github"
                            name="github"
                            value={formData.github}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>
                </div>

                <div className="flex gap-5 mt-8">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="website" className="block text-sm font-medium mb-1">Website</label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-[var(--sidebar)] text-white rounded-md hover:bg-[var(--lavender)] hover:text-[var(--heading)]"
                >
                    Create Contact
                </button>
            </form>
        </div>
    );
};

export default AddContactPage;