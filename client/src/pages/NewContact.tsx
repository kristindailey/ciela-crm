import { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";

const NewContact = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const handleSave = async (contactData: any) => {
        try { 
            const response = await fetch(`${API_BASE_URL}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactData),
            });

            const newContact = await response.json();

            navigate(`/contacts/${newContact.id}`);
        } catch (error) {
            console.error("Error creating contact:", error);
        }
    };

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <div className="p-6 text-black">
                    <h1 className="text-2xl font-bold mb-4">New Contact</h1>
                    {/* ADD CONTACT FORM */}
                    <p>Contact creation form will go here.</p>
                </div>
            </div>
        </div>
    );
};

export default NewContact;