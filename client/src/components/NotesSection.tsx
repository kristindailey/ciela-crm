import { useState, useEffect, useRef } from "react";

interface NotesSectionProps {
    label: string;
    value: string | undefined;
    placeholder: string;
    onSave: (newValue : string) => void;
}

const NotesSection = ({ label, value, placeholder, onSave }: NotesSectionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value || "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleClick = () => {
        setIsEditing(true);
        setEditValue(value || "");
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditValue(event.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);

        if (editValue !== (value || "")) {
            onSave(editValue);
        }
    };

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }, [isEditing]);

    return (
        <div>
            <label className="font-inter text-sm text-gray-600 block">{label}</label>
            <div 
                className="bg-white rounded-xl shadow-md cursor-pointer transition-all text-md font-medium text-[var(--royal-blue)] h-70 w-full"
                onClick={!isEditing ? handleClick : undefined}
            >
                {isEditing ? (
                    <textarea 
                        value={editValue}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        ref={textareaRef}
                        className="w-full h-full resize-none border-none outline-none bg-transparent px-4 pt-4"
                    />
                ) : (
                    <p className="px-4 pt-4 whitespace-pre-wrap">
                        { value || placeholder}
                    </p>
                )}
            </div>
        </div>
    );
};

export default NotesSection;