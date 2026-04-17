import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Papa from "papaparse";
import type { Contact } from "../types/contact";
import { usePagination } from "../hooks/usePagination";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";
import ContactCard from "../components/ContactCard";
import Pagination from "../components/Pagination";
import UploadModal from "../components/UploadModal";

const Contacts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [activeTier, setActiveTier] = useState("TIER_1");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{
        isProcessing: boolean;
        imported: number;
        skipped: number;
        errors: number;
    } | null>(null);
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

    const { currentPage, windowStart, setCurrentPage, totalPages, paginatedItems: paginatedContacts, handlePageChange } = usePagination<Contact>({
        items: filteredContacts,
        itemsPerPage: 6,
    });

    const handleAddContact = () => {
        navigate("/contacts/new");
    };

    const handleSearchContacts = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleUploadContacts = () => {
        setUploadStatus(null);
        setIsModalOpen(true);
    };

    const handleDownloadTemplate = () => {
        const headers = [
            "firstName",
            "lastName",
            "email",
            "role",
            "linkedin",
            "bluesky",
            "github",
            "website",
            "location",
            "notes",
            "companyName",
        ];

        const guidanceRow = [
            "(Required)",
            "(Required)",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "(Required)",
        ];

        const csvContent = headers.join(",") + "\n" + guidanceRow.join(",");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "contacts_template.csv";
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const handleUploadCSV = async (file: File) => {
        setUploadStatus({ isProcessing: true, imported: 0, skipped: 0, errors: 0 });

        try {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const rows = results.data as any[];
                    let imported = 0;
                    let skipped = 0;
                    let errors = 0;

                    for (const row of rows) {
                        try {
                            if (row.firstName?.includes("Required") || row.firstName.startsWith("(")) {
                                continue;
                            }

                            if (!row.firstName || !row.lastName || !row.companyName) {
                                errors++;
                                continue;
                            }

                            const isDuplicate = contacts.some(
                                (contact) =>
                                    contact.firstName.toLowerCase() === row.firstName.toLowerCase() &&
                                    contact.lastName.toLowerCase() === row.lastName.toLowerCase() &&
                                    contact.company.name.toLowerCase() === row.companyName.toLowerCase()
                            );

                            if (isDuplicate) {
                                skipped++;
                                continue;
                            }

                            const companyResponse = await fetch(`${API_BASE_URL}/companies/upload`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({
                                    name: row.companyName,
                                    tier: "BACKLOG",
                                }),
                            });

                            if (!companyResponse.ok) {
                                errors++;
                                continue;
                            }

                            const company = await companyResponse.json();

                            const contactResponse = await fetch(`${API_BASE_URL}/contacts`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({
                                    firstName: row.firstName,
                                    lastName: row.lastName,
                                    email: row.email || null,
                                    role: row.role || null,
                                    linkedin: row.linkedin || null,
                                    bluesky: row.bluesky || null,
                                    github: row.github || null,
                                    website: row.website || null,
                                    location: row.location || null,
                                    notes: row.notes || null,
                                    companyId: company.id,
                                }),
                            });

                            if (!contactResponse.ok) {
                                errors++;
                                continue;
                            }

                            const newContact = await contactResponse.json();
                            setContacts((prev) => [...prev, newContact]);

                            imported++;
                        } catch (error) {
                            errors++;
                        }
                    }

                    setUploadStatus({ isProcessing: false, imported, skipped, errors });
                },
                error: (error) => {
                    console.error("Parse error:", error);
                    setUploadStatus({ isProcessing: false, imported: 0, skipped: 0, errors: 1 });
                },
            });
        } catch (error) {
            console.error("Failed to upload CSV:", error);
            setUploadStatus({ isProcessing: false, imported: 0, skipped: 0, errors: 1 });
        }
    };

    const handleTierChange = (tier: string) => {
        setActiveTier(tier);
        setCurrentPage(1);
    };

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
        <>
            <PageHeader 
                title="contacts"
                searchValue={searchQuery}
                searchPlaceholder="Search contacts..."
                onSearchChange={handleSearchContacts}
                onAddClick={handleAddContact}
                onUploadClick={handleUploadContacts}
            />

        	<TierTabs 
                tiers={tiers}
                activeTier={activeTier}
                onTierChange={handleTierChange}
            />

            <div className="p-6">
				<div className="flex flex-col min-h-[calc(100vh-380px)]">
					<div className={`${paginatedContacts.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start" : ""} flex-grow`}>
						{paginatedContacts.map((contact) => (
							<ContactCard 
								key={contact.id} 
								contact={contact} 
								onDelete={() => handleDeleteContact(contact.id)}
							/>
						))}

						{isLoading && (
                    		<div className="text-center text-muted mt-8">
                        		Loading contacts...
                    		</div>
                		)}

                		{!isLoading && contacts.length === 0 && (
                    		<div className="text-center text-muted mt-8">
                           		Ready to add your first contact? Click the + button to get started.
                    		</div>
                		)}

                		{!isLoading && contacts.length > 0 && filteredContacts.length === 0 && searchQuery && (
                    		<div className="text-center text-muted mt-8">
                        		No contacts found matching your search.
                    		</div>
                		)}
					</div>
				</div>

                <Pagination
                    currentPage={currentPage}
					windowStart={windowStart}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <UploadModal
                isOpen={isModalOpen}
                uploadType="Contacts"
                onClose={() => {
                    setIsModalOpen(false);
                    setUploadStatus(null);
                }}
                onDownloadTemplate={handleDownloadTemplate}
                onUpload={handleUploadCSV}
                uploadStatus={uploadStatus}
            />
        </>
    );
};

export default Contacts;