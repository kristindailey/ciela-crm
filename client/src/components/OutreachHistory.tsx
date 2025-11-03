import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import AddInteractionModal from "./AddInteractionModal";

interface OutreachHistoryProps {
    label: string;
}

const OutreachHistory = ({ label }: OutreachHistoryProps) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setAddModalOpen(false);
            }
        };
    
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setAddModalOpen(false);
            }
        };
    
        if (isAddModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
    }, [isAddModalOpen]);

    return (
        <div>
            <label className="font-inter text-sm text-gray-600 block">{label}</label>

            <div className="flex items-start justify-end bg-white rounded-xl shadow-md cursor-pointer transition-all text-md font-medium text-[var(--royal-blue)] h-70 w-full">
                <button 
                    onClick={() => setAddModalOpen(!isAddModalOpen)}
                    className="inline-flex h-6 w-6 mt-2 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] drop-shadow-sm transition-colors duration-150 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] mr-2"
                >
                    <FaPlus size={14} />
                </button>
            </div>

            {isAddModalOpen &&
                <AddInteractionModal 
                    isOpen={isAddModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onConfirm={() => setAddModalOpen(false)}
                />
            }
        </div>
    );
};

export default OutreachHistory;