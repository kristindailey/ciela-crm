import { useState } from "react";
import type { IconType } from "react-icons";
import { FiEdit2 } from "react-icons/fi";

interface IconProps {
    url: string | undefined;
    icon: IconType;
    label: string;
    onSave: (newValue: string) => Promise<void>;
}

const Icon = ({ url, icon: Icon, label, onSave }: IconProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(url || "");

    const labelMap: Record<string, string> = {
        email: "Email",
        bluesky: "Bluesky",
        github: "GitHub",
        linkedin: "LinkedIn",
        website: "Website",
        careersPage: "Careers Page",
        glassdoor: "Glassdoor",
        blind: "Blind",
    };

    const handleSave = async () => {
        setIsEditing(false);

        if (value !== url) {
            await onSave(value);
        }
    };

    if (isEditing) {
        return (
            <div className="relative">
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") {
                            setValue(url || "");
                            setIsEditing(false);
                        }
                    }}
                    placeholder={`${labelMap[label]} URL`}
                    className="w-32 sm:w-40 md:w-48 px-2 py-1 text-sm border border-[var(--royal-blue)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--royal-blue)]"
                    autoFocus
                />
            </div>
        );
    }

    return (
        <div className="relative group">
            <a
                href={label === "email" && url ? `mailto:${url}` : url || "#"}
                target={url && label !== "email" ? "_blank" : undefined}
                rel={url ? "noopener noreferrer" : undefined}
                className={`flex items-center justify-center w-9 h-9 rounded-full bg-[var(--soft-lavender)] hover:bg-[var(--royal-blue)] shadow-md transition-colors ${url ? "text-[var(--royal-blue)] hover:text-[var(--soft-lavender)]" : "text-gray-400 pointer-events-none"}`}
            >
                <Icon />
            </a>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                aria-label={`Edit ${labelMap[label]}`}
            >
                <FiEdit2 className="w-2.5 h-2.5"/>
            </button>
        </div>
    );
};

export default Icon;