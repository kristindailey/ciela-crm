import { useState, useRef, useEffect } from "react";
import type { Contact } from "../types/contact";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiBlueskyLine } from "react-icons/ri";
import { FiGithub, FiEdit2 } from "react-icons/fi";
import { CiLinkedin } from "react-icons/ci";
import { IoIosLink, IoIosMail } from "react-icons/io";
import Icon from "./Icon";
import DropdownMenu from "./DropdownMenu";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ContactHeaderProps {
    contact: Contact;
    onContactUpdate: (updatedContact: Contact) => void;
    onSaveField: (field: string, value: string) => Promise<void>;
    onDelete: () => void;
}

const ContactHeader = ({ contact, onContactUpdate, onSaveField, onDelete }: ContactHeaderProps) => {
    const [nameValue, setNameValue] = useState(`${contact.firstName} ${contact.lastName}`);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const iconLinks = [
        { url: contact.email, icon: IoIosMail, label: "email" },
        { url: contact.bluesky, icon: RiBlueskyLine, label: "bluesky" },
        { url: contact.github, icon: FiGithub, label: "github" },
        { url: contact.linkedin, icon: CiLinkedin, label: "linkedin" },
        { url: contact.website, icon: IoIosLink, label: "website" },
    ];

    const handleSaveName = async () => {
        const trimmedName = nameValue.trim();
        const [newFirstName, ...lastNameParts] = trimmedName.split(" ");
        const newLastName = lastNameParts.join(" ");

        if (newFirstName !== contact.firstName || newLastName !== contact.lastName) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${contact.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        firstName: newFirstName,
                        lastName: newLastName,
                    }),
                    credentials: "include",
                });

                if (response.ok) {
                    const updatedContact = await response.json();
                    onContactUpdate(updatedContact);
                }
            } catch (error) {
                console.error("Failed to save contact name:", error);
            }
        }

        setIsEditingName(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
    }, [isDropdownOpen]);

    return (
        <div className="mb-4">
            <div className="flex items-end w-full mt-20 px-5">
                <div className="flex items-end gap-6 font-inter">
                    {isEditingName ? (
                        <input 
                            type="text"
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                            onBlur={handleSaveName}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveName();
                                if (e.key === "Escape") {
                                    setNameValue(`${contact.firstName} ${contact.lastName}`);
                                    setIsEditingName(false);
                                }
                            }}
                            className="text-[var(--heading)] font-extrabold text-3xl bg-transparent focus:outline-none focus:border-b-2 focus:border-[var(--lavender)]"
                            style={{ width: `${nameValue.length * 0.6}em` }}
                            autoFocus 
                        />
                    ) : (
                        <h1 className="relative group text-[var(--heading)] font-extrabold text-3xl">
                            {contact.firstName} {contact.lastName}
                            <button
                                onClick={() => setIsEditingName(true)}
                                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-card border border-card-border rounded-full text-muted hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                                aria-label="Edit contact name"
                            >
                                <FiEdit2 className="w-3 h-3"/>
                            </button>
                        </h1>
                    )}

                    {contact.company.logoUrl && (
                        <div>
                            <img 
                                src={contact.company.logoUrl} 
                                alt={`${contact.company} logo`}
                                className="h-15 object-contain" 
                            />
                        </div>
                    )}

                    <div className="inline-flex h-10 px-6 items-center justify-center rounded-full bg-sidebar text-sidebar-text text-lg font-bold">
                        {contact.company.tier.toLowerCase().replace("_", " ")}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-2xl text-[var(--heading)] ml-auto">
                    {iconLinks.map(({ url, icon, label }) => (
                        <Icon 
                            key={label}
                            url={url}
                            icon={icon}
                            label={label}
                            onSave={(newValue) => onSaveField(label, newValue)}
                        />
                    ))}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-dropdown hover:bg-dropdown-hover text-dropdown-text hover:text-gray-50 shadow-md transition-colors ml-10"
                    >
                        <BsThreeDotsVertical size={22} />
                    </div>

                    {isDropdownOpen && 
                        <DropdownMenu 
                            itemType="Contact" 
                            onDeleteClick={() => {
                                setIsDeleteModalOpen(true);
                                setIsDropdownOpen(false);
                            }}
                        />
                    }
                </div>

                <DeleteConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    itemName={`${contact.firstName} ${contact.lastName}`}
                    itemType="Contact"
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => {
                        onDelete();
                        setIsDeleteModalOpen(false);
                    }}
                />
            </div>

            <div className="h-11 bg-sidebar mt-2 mx-5"></div>
            <div className="h-[5px] bg-sidebar-text mt-1 mx-5"></div>
        </div>
    );
};

export default ContactHeader;