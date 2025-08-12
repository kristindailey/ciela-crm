import { useNavigate } from "react-router";
import type { Contact } from "../types/contact";

interface ContactCardProps {
    contact: Contact;
}

const ContactCard = ({ contact }: ContactCardProps) => {
    const navigate = useNavigate();
    
    const formatTier = (tier: string) => {
        return tier
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/^\w/, c => c.toUpperCase());
    };

    const handleClick = () => {
        navigate(`/contacts/${contact.id}`);
    };

    return (
        <div
            onClick={handleClick} 
            className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30 transition-all"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--royal-blue)] mb-2">
                    {contact.firstName} {contact.lastName}
                </h3>

                {contact.company.logoUrl && (
                    <img 
                        src={contact.company.logoUrl} 
                        alt={`${contact.company.name} logo`}
                        className="h-10 max-w-16 object-contain"
                    />
                )}
            </div>

            <div className="text-sm text-gray-600 font-medium">
                <span>{contact.company.name}</span>
            </div>

            <div className="text-sm text-gray-600 font-medium">
                <span>{contact.role}</span>
            </div>

            {contact.email && (
                <a 
                    href={`mailto:${contact.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm mb-2 block"
                >
                {contact.email}
                </a>
            )}
            <div className="text-sm text-gray-600 font-medium">
                <span>{formatTier(contact.company.tier)}</span>
            </div>

        </div>
    );
};

export default ContactCard;