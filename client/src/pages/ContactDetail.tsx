import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Sidebar from "../components/Sidebar";
import type { Contact } from "../types/contact";

const ContactDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [contact, setContact] = useState<Contact | null>(null)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                    credentials: "include",
                });

                if (response.ok) {
                    const contactData = await response.json();
                    setContact(contactData);
                }
            } catch (error) {
                console.error("Error fetching contact:", error);
            }
        };

        if (id) {
            fetchContact();
        }
    }, [id, API_BASE_URL]);

    if (!contact) {
        return null;
    }

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">
                        {contact.firstName} {contact.lastName}
                    </h1>
                    <pre>{JSON.stringify(contact, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default ContactDetail;