import type { Contact } from "../types/contact";
import { RiBlueskyLine } from "react-icons/ri";
import { FiGithub } from "react-icons/fi";
import { CiLinkedin } from "react-icons/ci";
import { IoIosLink, IoIosMail } from "react-icons/io";
import SocialIcon from "./SocialIcon";

interface ContactHeaderProps {
    contact: Contact;
    onSaveField: (field: string, value: string) => Promise<void>;
}

const ContactHeader = ({ contact, onSaveField }: ContactHeaderProps) => {
    const socialLinks = [
        { url: contact.email, icon: IoIosMail, label: "email" },
        { url: contact.bluesky, icon: RiBlueskyLine, label: "bluesky" },
        { url: contact.github, icon: FiGithub, label: "github" },
        { url: contact.linkedin, icon: CiLinkedin, label: "linkedin" },
        { url: contact.website, icon: IoIosLink, label: "website" },
    ];

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between w-full mt-20 ml-5 mr-5">
                <div className="flex items-center gap-4 font-inter">
                    <h1 className="text-[var(--royal-blue)] font-extrabold text-4xl mt-5">{contact.firstName} {contact.lastName}</h1>

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