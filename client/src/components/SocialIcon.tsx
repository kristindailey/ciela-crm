import { useState } from "react";
import type { IconType } from "react-icons";

interface SocialIconProps {
    url: string | undefined;
    icon: IconType;
    label: string;
    onSave: (newValue: string) => Promise<void>;
}

const SocialIcon = ({ url, icon: Icon, label, onSave }: SocialIconProps) => {
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
    };

    const handleSave = async () => {
        setIsEditing(false);

        if (value !== url) {
            await onSave(value);
        }
    };

    if (isEditing) {
        return (
            <input 
                type="text" 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder={`${labelMap[label]} URL`}
                className="w-32 sm:w-40 md:w-48 px-2 py-1 text-sm border border-[var(--royal-blue)] rounded focus:outline-none"
                autoFocus
            />
        );
    }

    return (
        <a
            href={label === "email" && url ? `mailto:${url}` : url || undefined}
            target={url && label !== "email" ? "_blank" : undefined}
            rel={url ? "noopener noreferrer" : undefined}
            onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
            }}
            className={`${url ? "hover:text-[var(--soft-lavender)]" : "text-gray-300"} cursor-pointer`}
        >
            <Icon />
        </a>
    );
};

export default SocialIcon;