import { useState, useEffect } from "react";
import type { Contact } from "../types/contact";
import ContactCard from "./ContactCard";

interface CompanyContactsProps {
	companyId: string;
}

const CompanyContacts = ({ companyId }: CompanyContactsProps) => {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/companies/${companyId}/contacts`, {
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

		if (companyId) {
			fetchContacts();
		}
	}, [companyId, API_BASE_URL]);

	useEffect(() => {
        let filtered = contacts;

        if (searchQuery !== "") {
            filtered = filtered.filter((contact) => {
                return contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.email?.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }

        setFilteredContacts(filtered);
    }, [contacts, searchQuery]);

	return (
		<div className="px-5 mt-5">
			<div className="mb-4">
				<input 
					type="text" 
					placeholder="Search contacts..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent text-black"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredContacts.map((contact) => (
					<ContactCard key={contact.id} contact={contact}/>
				))}
			</div>

			{filteredContacts.length === 0 && (
				<div className="text-center text-gray-500 mt-8">
					{searchQuery ? "No contacts found matching your search." : "No contacts yet for this company."}
				</div>
			)}
		</div>
	);
}

export default CompanyContacts;