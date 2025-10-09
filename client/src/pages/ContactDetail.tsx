import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { Contact } from "../types/contact";
import Sidebar from "../components/Sidebar";
import ContactHeader from "../components/ContactHeader";
import InfoPill from "../components/InfoPill";
import NotesSection from "../components/NotesSection";
import OutreachHistory from "../components/OutreachHistory";

const ContactDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [contact, setContact] = useState<Contact | null>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    };

    const handleContactUpdate = (updatedContact: Contact) => {
        setContact(updatedContact);
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

    const handleSaveSocialField = async (field: string, newValue: string) => {
        if (!contact) return;

        setContact((prev) => prev ? { ...prev, [field]: newValue } : null);

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`, {
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
                <ContactHeader 
                    contact={contact} 
                    onContactUpdate={handleContactUpdate}
                    onSaveField={handleSaveSocialField}
                />

                <div className="grid grid-cols-4 gap-4 px-5 mt-5">
                    <InfoPill 
                        label="Role"
                        value={contact.role}
                        placeholder="Add role"
                        onSave={(newValue) => handleSaveRole(newValue)}
                    />
                    <InfoPill 
                        label="Company"
                        value={contact.company.name}
                        placeholder="Add company"
                        onSave={(newValue) => handleSaveCompany(newValue)}
                    />
                    <InfoPill
                        label="Location"
                        value={contact.location}
                        placeholder="Add location"
                        onSave={(newValue) => handleSaveLocation(newValue)}
                    />
                    <InfoPill 
                        label="Last Contacted"
                        value={contact.updatedAt ? formatDate(contact.updatedAt) : undefined}
                        placeholder="Not yet contacted"
                        onSave={(newValue) => handleSaveDate(newValue)}
                    />
                </div>

                <div className="grid grid-cols-12 gap-4 px-5 mt-5">
                    <div className="col-span-4">
                        <NotesSection 
                            label="Contact Notes"
                            value={contact.notes}
                            placeholder="Add contact notes"
                            onSave={(newValue) => handleSaveContactNotes(newValue)}
                        />
                    </div>
                    
                    <div className="col-span-4">
                        <NotesSection 
                            label="Outreach Notes"
                            value={contact.outreachNotes}
                            placeholder="Add outreach notes"
                            onSave={(newValue) => handleSaveOutreachNotes(newValue)}
                        />
                    </div>
                    
                    <div className="col-span-4">
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

export default ContactDetail;