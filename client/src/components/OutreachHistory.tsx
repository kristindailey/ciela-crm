import { FaPlus } from "react-icons/fa6";

interface OutreachHistoryProps {
    label: string;
    onAddClick: () => void;
}

const OutreachHistory = ({ label, onAddClick }: OutreachHistoryProps) => {
    return (
        <div>
            <label className="font-inter text-sm text-gray-600 block">{label}</label>
            <div className="flex items-start justify-end bg-white rounded-xl shadow-md cursor-pointer transition-all text-md font-medium text-[var(--royal-blue)] h-70 w-full">
                <button 
                    onClick={onAddClick}
                    className="inline-flex h-6 w-6 mt-2 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] drop-shadow-sm transition-colors duration-150 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] mr-2"
                >
                    <FaPlus size={14} />
                </button>
            </div>
        </div>
    );
};

export default OutreachHistory;