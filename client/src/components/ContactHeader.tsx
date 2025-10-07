import { useState } from "react";
import type { Contact } from "../types/contact";
import { RiBlueskyLine } from "react-icons/ri";
import { FiGithub, FiEdit2 } from "react-icons/fi";
import { CiLinkedin } from "react-icons/ci";
import { IoIosLink, IoIosMail } from "react-icons/io";
import SocialIcon from "./SocialIcon";

interface ContactHeaderProps {
    contact: Contact;
    onContactUpdate: (updatedContact: Contact) => void;
    onSaveField: (field: string, value: string) => Promise<void>;
}

const ContactHeader = ({ contact, onContactUpdate, onSaveField }: ContactHeaderProps) => {
    const [nameValue, setNameValue] = useState(`${contact.firstName} ${contact.lastName}`);
    const [isEditingName, setIsEditingName] = useState(false);
    const socialLinks = [
        { url: contact.email, icon: IoIosMail, label: "email" },
        { url: contact.bluesky, icon: RiBlueskyLine, label: "bluesky" },
        { url: contact.github, icon: FiGithub, label: "github" },
        { url: contact.linkedin, icon: CiLinkedin, label: "linkedin" },
        { url: contact.website, icon: IoIosLink, label: "website" },
    ];

    const handleSaveName = async () => {
        const trimmedName = nameValue.trim();
        const [newFirstName, ...lastNameParts] = trimmedName.split(" ");
        const newLastName = lastNameParts.join(" ");

        if (newFirstName !== contact.firstName || newLastName !== contact.lastName) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/${contact.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        firstName: newFirstName,
                        lastName: newLastName,
                    }),
                    credentials: "include",
                });

                if (response.ok) {
                    const updatedContact = await response.json();
                    onContactUpdate(updatedContact);
                }
            } catch (error) {
                console.error("Failed to save contact name:", error);
            }
        }

        setIsEditingName(false);
    };

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between w-full mt-20 ml-5 mr-5">
                <div className="flex items-center gap-4 font-inter">
                    {isEditingName ? (
                        <input 
                            type="text"
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                            onBlur={handleSaveName}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveName();
                                if (e.key === "Escape") {
                                    setNameValue(`${contact.firstName} ${contact.lastName}`);
                                    setIsEditingName(false);
                                }
                            }}
                            className="text-[var(--royal-blue)] font-extrabold text-3xl mt-5 bg-transparent focus:outline-none focus:border-b-2 focus:border-[var(--soft-lavender)]"
                            style={{ width: `${nameValue.length * 0.6}em` }}
                            autoFocus 
                        />
                    ) : (
                        <h1 className="relative group text-[var(--royal-blue)] font-extrabold text-3xl mt-5">
                            {contact.firstName} {contact.lastName}
                            <button
                                onClick={() => setIsEditingName(true)}
                                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                                aria-label="Edit contact name"
                            >
                                <FiEdit2 className="w-3 h-3"/>
                            </button>
                        </h1>
                    )}

                    {contact.company.logoUrl && (
                        <div className="ml-8">
                            <img 
                                src={contact.company.logoUrl} 
                                alt={`${contact.company} logo`}
                                className="h-15 object-contain" 
                            />
                        </div>
                    )}

                    <div className="inline-flex h-10 px-6 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] text-lg font-bold ml-8 mt-5">
                        {contact.company.tier.toLowerCase().replace("_", " ")}
                    </div>

                    <div className="flex items-center gap-4 text-3xl text-[var(--royal-blue)] ml-160 mt-7">
                        {socialLinks.map(({ url, icon, label }) => (
                            <SocialIcon 
                                key={label}
                                url={url}
                                icon={icon}
                                label={label}
                                onSave={(newValue) => onSaveField(label, newValue)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-4 bg-[var(--soft-lavender)] mt-2 mx-5"></div>
        </div>
    );
};

export default ContactHeader;