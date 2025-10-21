import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import type { Contact } from "../types/contact";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";
import ContactCard from "../components/ContactCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";

const Contacts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [activeTier, setActiveTier] = useState("TIER_1");
    const itemsPerPage = 9;
    const tiers = ["TIER_1", "TIER_2", "TIER_3", "BACKLOG", "ALL"];
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const filteredContacts = useMemo(() => {
        let filtered = contacts;

        if (activeTier !== "ALL") {
            filtered = filtered.filter((contact) => {
              return contact.company.tier === activeTier;  
            });
        }

        if (searchQuery !== "") {
            filtered = filtered.filter((contact) => {
                const normalizedTier = contact.company.tier.toLowerCase().replace("_", " ");
                return contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    normalizedTier.includes(searchQuery.toLowerCase());
            });
        }

        return filtered;
    }, [contacts, searchQuery, activeTier]);

    const { currentPage, setCurrentPage, totalPages, paginatedItems: paginatedContacts, handlePageChange } = usePagination<Contact>({
        items: filteredContacts,
        itemsPerPage,
    });

    const handleAddContact = () => {
        navigate("/contacts/new");
    };

    const handleSearchContacts = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleTierChange = (tier: string) => {
        setActiveTier(tier);
        setCurrentPage(1);
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, []);

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
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start ${
                        paginatedContacts.length > 0 ? "lg:min-h-[490px]" : ""
                    }`}>
                            {paginatedContacts.map((contact) => (
                                <ContactCard key={contact.id} contact={contact} />
                            ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />

                    {isLoading && (
                        <div className="text-center text-gray-500 mt-8">
                            Loading contacts...
                        </div>
                    )}

                    {!isLoading && contacts.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            Ready to add your first contact? Click the + button to get started.
                        </div>
                    )}

                    {!isLoading && contacts.length > 0 && filteredContacts.length === 0 && searchQuery && (
                        <div className="text-center text-gray-500 mt-8">
                            No contacts found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contacts;