import { useState } from "react";

interface InfoPillProps {
    label: string;
    value: string | undefined;
    placeholder: string;
    size?: "small" | "default";
    dropdownOptions?: string[];
    onSave: (newValue: string) => void;
}


const InfoPill = ({ label, value, placeholder, size = "default", dropdownOptions, onSave }: InfoPillProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value || "");

    const handleClick = () => {
        setIsEditing(true);
        setEditValue(value || "");
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
            <div className={`bg-white rounded-xl shadow-md cursor-pointer transition-all text-medium font-semibold text-[var(--royal-blue)] overflow-hidden flex items-center justify-center 
                ${size === "small" ? "h-20 w-24" : "h-25 w-85"}`}
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
                        onClick={handleClick}
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