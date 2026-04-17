import { useState, useEffect, useMemo } from "react";
import type { Contact } from "../types/contact";
import type { Company } from "../types/company";
import ContactCard from "./ContactCard";
import Pagination from "./Pagination";
import { usePagination } from "../hooks/usePagination";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface CompanyContactsProps {
	companyId: string;
	company: Company;
}

const CompanyContacts = ({ companyId, company }: CompanyContactsProps) => {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const itemsPerPage = 9;
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const filteredContacts = useMemo(() => {
		let filtered = contacts;

        if (searchQuery !== "") {
            filtered = filtered.filter((contact) => {
                return contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.email?.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }

        return filtered;
	}, [contacts, searchQuery]);

	const { currentPage, windowStart, setCurrentPage, totalPages, paginatedItems: paginatedContacts, handlePageChange } = usePagination<Contact>({
		items: filteredContacts,
		itemsPerPage,
	});

	const handleDeleteContact = async (contactId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete contact.");
            }

            setContacts((prevContacts) => 
                prevContacts.filter((contact) => contact.id !== contactId)
            );
        } catch (error) {
            console.error("Failed to delete contact:", error);
        }
    };

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
			} finally {
				setIsLoading(false);
			}
		};

		if (companyId) {
			fetchContacts();
		}
	}, [companyId, API_BASE_URL]);

	return (
		<div className="px-5 mt-5">
			<div className="relative mb-4">
				<input 
					type="text" 
					placeholder="Search contacts..."
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						setCurrentPage(1);
					}}
					className="w-full px-10 py-2 border border-2 border-[var(--input-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--heading)] focus:border-transparent text-primary"
				/>

				<div className="absolute left-3 top-1/2 translate -translate-y-1/2">
					<FaMagnifyingGlass className="text-[var(--heading)]"/>
				</div>
			</div>

			<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start ${
				paginatedContacts.length > 0 ? "lg:min-h-[490px]" : ""
			}`}>
				{paginatedContacts.map((contact) => (
					<ContactCard 
						key={contact.id} 
						contact={contact}
						onDelete={() => handleDeleteContact(contact.id)}
					/>
				))}
			</div>

			<Pagination 
				currentPage={currentPage}
				windowStart={windowStart}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>

			{isLoading && (
				<div className="text-center text-muted mt-8">
					Loading contacts...
				</div>
			)}

			{!isLoading && contacts.length === 0 && (
				<div className="text-center text-muted mt-8">
					{`No contacts at ${company.name}. Add your first contact`}.
				</div>
			)}

			{!isLoading && contacts.length > 0 && filteredContacts.length === 0 && (
				<div className="text-center text-muted mt-8">
					No contacts found matching your search.
				</div>
			)}
		</div>
	);
}

export default CompanyContacts;