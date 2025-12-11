import { useState, useRef, useEffect } from "react";
import type { Application } from "../types/application";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownMenu from "./DropdownMenu";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ContactCardProps {
	application: Application;
	onDelete: () => void;
}

const ApplicationCard = ({ application, onDelete }: ContactCardProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const formatTier = (tier: string) => {
        return tier
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/^\w/, c => c.toUpperCase());
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
            className="flex flex-col relative bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30 transition-all h-[162px]"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--royal-blue)]">
                    {application.jobTitle}
                </h3>

                {application.company.logoUrl && (
                    <img 
                        src={application.company.logoUrl} 
                        alt={`${application.company.name} logo`}
                        className="h-10 max-w-16 object-contain mr-6"
                    />
                )}
            </div>

            <div className="text-sm text-gray-600 font-medium">
                <span>{application.company.name}</span>
            </div>

            <div className="text-sm text-gray-600 font-medium">
                <span>{application.status}</span>
            </div>

            <div className="text-sm text-gray-600 font-medium mt-auto">
                <span>{formatTier(application.company.tier)}</span>
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
                        itemType="Application"
                        onDeleteClick={() => {
                            setIsDeleteModalOpen(true);
                            setIsDropdownOpen(false);
                        }} 
                    />
                }
            </div>

			<DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                itemName={`the application for ${application.jobTitle} at ${application.company.name}`}
                itemType="Application"
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onDelete();
                    setIsDeleteModalOpen(false);
                }}
            />
        </div>
	);
};

export default ApplicationCard;