import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Company } from "../types/company";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownMenu from "./DropdownMenu";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface CompanyCardProps {
	company: Company;
	onDelete: () => void;
}

const CompanyCard = ({ company, onDelete }: CompanyCardProps) => {
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
    	navigate(`/companies/${company.id}`);
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
      		className="relative bg-card p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:bg-[var(--sidebar)]/10 transition-all"
    	>
      		<div className="flex items-center justify-between">
        		<h3 className="text-lg font-semibold text-[var(--heading)]">
          			{company.name}
        		</h3>

				{company.logoUrl && (
					<img 
						src={company.logoUrl} 
						alt={`${company.name} logo`}
						className="h-10 max-w-16 object-contain mr-5"
					/>
				)}
      		</div>
      
      		<span className="text-sm text-muted font-medium">{formatTier(company.tier)}</span>

			<div className="absolute top-2 right-2" ref={dropdownRef}>
                <div 
                    onClick={(e) => {
						e.stopPropagation();
						setIsDropdownOpen(!isDropdownOpen);
					}}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-dropdown hover:bg-dropdown-hover text-dropdown-text hover:text-gray-50 shadow-md transition-colors"
                >
                    <BsThreeDotsVertical size={18} />
                </div>

                {isDropdownOpen && 
                    <DropdownMenu 
                        itemType="Company"
                        onDeleteClick={() => {
                            setIsDeleteModalOpen(true);
                            setIsDropdownOpen(false);
                        }} 
                    />
                }
            </div>

			<DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                itemName={company.name}
                itemType="Company"
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onDelete();
                    setIsDeleteModalOpen(false);
                }}
            />
    	</div>
  	);
};

export default CompanyCard;