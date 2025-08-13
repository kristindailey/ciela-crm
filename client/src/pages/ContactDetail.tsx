import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { Contact } from "../types/contact";
import Sidebar from "../components/Sidebar";
import ContactHeader from "../components/ContactHeader";
import ContactInfoPill from "../components/ContactInfoPill";
import NotesSection from "../components/NotesSection";

const ContactDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [contact, setContact] = useState<Contact | null>(null)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    };

    const handleSaveRole = async (newRole: string) => {
        if (!contact) {
            return;
        }

        setContact((prev) => prev ? { 
            ...prev, 
            role: newRole,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save role:", error);
        }
    };

    const handleSaveCompany = async (newCompany: string) => {
        setContact((prev) => prev ? { 
            ...prev, 
            company: { ...prev.company, name: newCompany },
        } : null); 
    };

    const handleSaveLocation = async (newLocation: string) => {
        if (!contact) {
            return;
        }
        
        setContact((prev) => prev ? { 
            ...prev, 
            location: newLocation,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ location: newLocation }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save location:", error);
        }
    };

    const handleSaveDate = async (newDate: string) => {
        console.log("Date save not implemented yet:", newDate);
    };

    const handleSaveContactNotes = async (newNotes: string) => {
        if (!contact) {
            return;
        }

        setContact((prev) => prev ? { 
            ...prev, 
            notes: newNotes,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: newNotes }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save contact notes:", error);
        }
    };

    const handleSaveOutreachNotes = async (newNotes: string) => {
        if (!contact) {
            return;
        }

        setContact((prev) => prev ? { 
            ...prev, 
            outreachNotes: newNotes,
        } : null);

        try { 
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ outreachNotes: newNotes }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to save outreach notes:", error);
        }
    }; 

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
                <ContactHeader contact={contact} />

                <div className="flex gap-5 px-5 mt-3">
                    <ContactInfoPill 
                        label="Role"
                        value={contact.role}
                        placeholder="No role specified"
                        onSave={(newValue) => handleSaveRole(newValue)}
                    />
                    <ContactInfoPill 
                        label="Company"
                        value={contact.company.name}
                        placeholder="No company specified"
                        onSave={(newValue) => handleSaveCompany(newValue)}
                    />
                    <ContactInfoPill
                        label="Location"
                        value={contact.location}
                        placeholder="No location specified"
                        onSave={(newValue) => handleSaveLocation(newValue)}
                    />
                    <ContactInfoPill 
                        label="Last Contacted"
                        value={contact.updatedAt ? formatDate(contact.updatedAt) : undefined}
                        placeholder="Never contacted"
                        onSave={(newValue) => handleSaveDate(newValue)}
                    />
                </div>

                <div className="flex gap-5 px-5 mt-3">
                    <NotesSection 
                        label="Contact Notes"
                        value={contact.notes}
                        placeholder="Click to add contact notes..."
                        onSave={(newValue) => handleSaveContactNotes(newValue)}
                    />
                    <NotesSection 
                        label="Outreach Notes"
                        value={contact.outreachNotes}
                        placeholder="Click to add outreach notes..."
                        onSave={(newValue) => handleSaveOutreachNotes(newValue)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ContactDetail;