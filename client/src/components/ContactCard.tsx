import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Contact } from "../types/contact";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownMenu from "./DropdownMenu";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ContactCardProps {
    contact: Contact;
    onDelete: () => void;
}

const ContactCard = ({ contact, onDelete }: ContactCardProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
    const formatTier = (tier: string) => {
        return tier
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/^\w/, c => c.toUpperCase());
    };

    const handleClick = () => {
        navigate(`/contacts/${contact.id}`);
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
	
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isDropdownOpen]);

    return (
        <div
            onClick={handleClick} 
            className="flex flex-col relative bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30 transition-all h-[162px]"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--royal-blue)]">
                    {contact.firstName} {contact.lastName}
                </h3>

                {contact.company.logoUrl && (
                    <img 
                        src={contact.company.logoUrl} 
                        alt={`${contact.company.name} logo`}
                        className="h-10 max-w-16 object-contain mr-6"
                    />
                )}
            </div>

            <div className="text-sm text-gray-600 font-medium">
                <span>{contact.company.name}</span>
            </div>

            <div className="text-sm text-gray-600 font-medium">
                <span>{contact.role}</span>
            </div>

            {contact.email && (
                <a 
                    href={`mailto:${contact.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm mb-2 self-start"
                    onClick={(e) => e.stopPropagation()}
                >
                    {contact.email}
                </a>
            )}

            <div className="text-sm text-gray-600 font-medium mt-auto">
                <span>{formatTier(contact.company.tier)}</span>
            </div>

            <div className="absolute top-2 right-2" ref={dropdownRef}>
                <div 
                    onClick={(e) => {
						e.stopPropagation();
						setIsDropdownOpen(!isDropdownOpen);
					}}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-500 hover:text-gray-50 shadow-md transition-colors"
                >
                    <BsThreeDotsVertical size={18} />
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
    );
};

export default ContactCard;