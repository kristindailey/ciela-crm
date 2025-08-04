import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";

const AddCompanyPage = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const handleSave = async (companyData: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/companies`, {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify(companyData),
                credentials: "include",
            });

            const newCompany = await response.json();

            // navigate(`/contacts/${newCompany.id}`);
            navigate(`/contacts`);
        } catch (error) {
            console.error("Error creating company:", error);
        }
    };

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <div className="p-6 text-black">
                    <h1 className="text-2xl font-bold mb-4">New Company</h1>
                    {/* ADD COMPANY FORM */}
                    <p>Company creation form will go here.</p>
                </div>
            </div>
        </div>
    );
};

export default AddCompanyPage;