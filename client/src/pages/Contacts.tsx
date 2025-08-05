import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Contact } from "../types/contact";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";
import ContactCard from "../components/ContactCard";

const Contacts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [activeTier, setActiveTier] = useState("TIER_1");
    const tiers = ["TIER_1", "TIER_2", "TIER_3", "BACKLOG", "ALL"];
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    const handleAddContact = () => {
        navigate("/contacts/new");
    };

    const handleSearchContacts = (value: string) => {
        setSearchQuery(value);
    };

    const handleTierChange = (tier: string) => {
        setActiveTier(tier);
    };

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts`, {
                    credentials: "include",
                });

                if (response.ok) {
                    const contactsData = await response.json();
                    setContacts(contactsData);
                } 
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        fetchContacts();
    }, []);

    useEffect(() => {
        let filtered = contacts;

        if (activeTier !== "ALL") {
            filtered = filtered.filter((contact) => {
              return contact.company.tier === activeTier;  
            });
        }

        if (searchQuery !== "") {
            filtered.filter((contact) => {
                return contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.company.name.toLowerCase().includes(searchQuery.toLowerCase())
            });
        }

        setFilteredContacts(filtered);
    }, [contacts, searchQuery, activeTier]);

    return (
        <div className="bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1">
                <PageHeader 
                    title="contacts"
                    searchValue={searchQuery}
                    searchPlaceholder="Search contacts..."
                    onSearchChange={handleSearchContacts}
                    onAddClick={handleAddContact}
                />

                <TierTabs 
                    tiers={tiers}
                    activeTier={activeTier}
                    onTierChange={handleTierChange}
                />

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContacts.map((contact) => (
                            <ContactCard key={contact.id} contact={contact} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacts;