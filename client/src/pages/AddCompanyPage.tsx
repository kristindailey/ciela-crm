import { useState } from "react";
import { useNavigate } from "react-router";
import { normalizeUrl } from "../utils/urlHelpers";

const AddCompanyPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        website: "",
        employeeCount: "",
        hqLocation: "",
        localLocation: "",
        description: "",
        tier: "BACKLOG",
    });
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/companies`, {
                method: "POST",
                headers: {  "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    employeeCount: parseInt(formData.employeeCount) || null,
                    website: normalizeUrl(formData.website),
                }),
                credentials: "include",
            });

            const newCompany = await response.json();
            navigate(`/companies/${newCompany.id}`);
        } catch (error) {
            console.error("Error creating company:", error);
        }
    };

    return (
        <div className="p-6 text-black">
            <h1 className="text-2xl font-bold mt-20 mb-4">Add New Company</h1>
                    
            <form className="space-y-4" onSubmit={handleSave}>
                <div className="flex gap-5 mt-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input 
                            type="text" 
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="website" className="block text-sm font-medium mb-1">Website</label>
                        <input 
                            type="text" 
                            id="website"
                            name="website"
                            required
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="tier" className="block text-sm font-medium mb-1">Tier</label>
                        <select 
                            id="tier"
                            name="tier" 
                            value={formData.tier}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                        >    
                            <option value="BACKLOG">Backlog</option>
                            <option value="TIER_1">Tier 1</option>
                            <option value="TIER_2">Tier 2</option>
                            <option value="TIER_3">Tier 3</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-5 mt-5">
                    <div>
                        <label htmlFor="employeeCount" className="block text-sm font-medium mb-1">Employee Count</label>
                        <input 
                            type="number" 
                            id="employeeCount"
                            name="employeeCount"
                            required
                            value={formData.employeeCount}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                        />
                    </div>

                    <div>
                		<label htmlFor="hqLocation" className="block text-sm font-medium mb-1">HQ Location</label>
                        <input 
                            type="text" 
                            id="hqLocation"
                            name="hqLocation"
                            required
                            value={formData.hqLocation}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="employeeCount" className="block text-sm font-medium mb-1">Local Location</label>
                        <input 
                            type="text" 
                            id="localLocation"
                            name="localLocation"
                            value={formData.localLocation}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        id="description"
                        name="description" 
                        rows={2}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
                    >    
                    </textarea>
                </div>

                <button
                    type="submit"
                    className="w-full px-3 py-2 bg-[var(--royal-blue)] text-white rounded-md hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] hover:font-medium"
                >
                    Create Company
                </button>
            </form>
        </div>
    );
};

export default AddCompanyPage;