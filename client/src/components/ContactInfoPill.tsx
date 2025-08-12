import { useState } from "react";

interface ContactInfoPillProps {
    label: string;
    value: string | undefined;
    placeholder: string;
    onSave: (newValue: string) => void;
}


const ContactInfoPill = ({ label, value, placeholder, onSave }: ContactInfoPillProps) => {
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        }
    };

    const handleBlur = () => {
        handleSave();
    };

    return (
        <div>
            <label className="text-sm text-gray-600 mb-1 block">{label}</label>
            <div className="bg-white px-20 py-10 rounded-xl shadow-md cursor-pointer transition-all text-lg font-semibold text-[var(--royal-blue)]">
                {isEditing ? (
                    <input 
                        type="text" 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                    />
                ) : (
                    <span 
                        onClick={handleClick}
                    >
                            { value || placeholder}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ContactInfoPill;