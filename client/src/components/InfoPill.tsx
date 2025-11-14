import { useState } from "react";

interface InfoPillProps {
    label: string;
    value: string | undefined;
    placeholder: string;
    dropdownOptions?: string[];
    readOnly?: boolean;
    onSave: (newValue: string) => void;
}


const InfoPill = ({ label, value, placeholder, dropdownOptions, readOnly = false, onSave }: InfoPillProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value || "");

    const handleClick = () => {
        if (readOnly) return;
        setIsEditing(true);
        setEditValue(value || (dropdownOptions?.[0] || ""));
    };  

    const handleSave = () => {
        setIsEditing(false);

        if (editValue !== (value || "")) {
            onSave(editValue);
        }
    };

    return (
        <div>
            <label className="font-inter text-sm text-gray-600 mb-1 block">{label}</label>
            <div 
                onClick={handleClick}
                className={`bg-white rounded-xl shadow-md transition-all text-medium font-semibold text-[var(--royal-blue)] overflow-hidden flex items-center justify-center h-25 w-full ${readOnly ? "" : "cursor-pointer"}`}
            >
                {isEditing ? (
                    dropdownOptions ? (
                        <select 
                            value={editValue}
                            onChange={(e) => {
                                setEditValue(e.target.value);
                                setIsEditing(false);
                                if (e.target.value !== (value || "")) {
                                    onSave(e.target.value);
                                }
                            }}
                            onBlur={handleSave}
                            className="border-none outline-none bg-transparent w-full min-w-0 text-center cursor-pointer"
                            autoFocus
                        >
                            {dropdownOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input 
                            type="text" 
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                            onBlur={handleSave}
                            className="border-none outline-none bg-transparent w-full min-w-0 text-center"
                            autoFocus
                        />
                    )
                ) : (
                    <span 
                        className="text-center"
                    >
                            { value || placeholder}
                    </span>
                )}
            </div>
        </div>
    );
};

export default InfoPill;