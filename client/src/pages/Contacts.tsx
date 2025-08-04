import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Contact } from "../types/contact";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";

const Contacts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [_filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    const handleAddContact = () => {
        navigate("/contacts/new");
    };

    const handleSearchContacts = (value: string) => {
        setSearchQuery(value);
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
        if (searchQuery === "") {
            setFilteredContacts(contacts);
        } else {
            const filtered = contacts.filter((contact) => {
                return contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.company.name.toLowerCase().includes(searchQuery.toLowerCase())
            });
            
            setFilteredContacts(filtered);
        }
    }, [contacts, searchQuery]);

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

                <div className="p-6 text-black">
                    <h2 className="text-xl font-semibold mb-4">Contacts ({contacts.length})</h2>
                    <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96 max-w-full whitespace-pre-wrap break-words">
                        {JSON.stringify(contacts, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default Contacts;