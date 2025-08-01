import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Contact } from "../types/contact";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";

const Contacts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, _setContacts] = useState<Contact[]>([]);
    const [_filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

    const navigate = useNavigate();

    const handleAddContact = () => {
        navigate("/contacts/new");
    };

    const handleSearchContacts = (value: string) => {
        setSearchQuery(value);
    };

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredContacts(contacts);
        } else {
            const filtered = contacts.filter((contact) => {
                contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            </div>
        </div>
    );
};

export default Contacts;