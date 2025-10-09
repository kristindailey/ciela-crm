interface OutreachHistoryProps {
    label: string;
    placeholder: string;
}

const OutreachHistory = ({ label, placeholder }: OutreachHistoryProps) => {
    return (
        <div>
            <label className="font-inter text-sm text-gray-600 block">{label}</label>
            <div 
                className="bg-white rounded-xl shadow-md cursor-pointer transition-all text-md font-medium text-[var(--royal-blue)] h-70 w-full"
            >
                <p className="pl-4 pt-4 whitespace-pre-wrap">{placeholder}</p>
            </div>
        </div>
    );
};

export default OutreachHistory;