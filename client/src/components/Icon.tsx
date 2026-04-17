import { useState } from "react";
import type { IconType } from "react-icons";
import { FiEdit2 } from "react-icons/fi";
import { normalizeUrl } from "../utils/urlHelpers";

interface IconProps {
    url: string | undefined;
    icon: IconType;
    label: string;
	size?: number;
    onSave: (newValue: string) => Promise<void>;
}

const Icon = ({ url, icon: Icon, label, size = 22, onSave }: IconProps) => {
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
		resumeUrl: "Resume",
		coverLetterUrl: "Cover Letter",
		projectDocsUrl: "Project Docs",
    };

    const handleSave = async () => {
        setIsEditing(false);
		const normalizedValue = normalizeUrl(value);

        if (normalizedValue !== url) {
            await onSave(normalizedValue);
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
                    className="w-32 sm:w-40 md:w-48 px-2 py-1 text-sm text-primary border border-[var(--input-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--heading)]"
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
                className={`flex items-center justify-center rounded-full bg-[var(--lavender)] hover:bg-[var(--sidebar)] shadow-md transition-colors ${size >= 22 ? "w-9 h-9" : "w-7 h-7"} ${url ? "text-heading hover:text-icon-hover" : "text-placeholder pointer-events-none"}`}
            >
                <Icon size={size} />
            </a>
			
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-card border border-card-border rounded-full text-muted hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                aria-label={`Edit ${labelMap[label]}`}
            >
                <FiEdit2 className="w-2.5 h-2.5"/>
            </button>
        </div>
    );
};

export default Icon;