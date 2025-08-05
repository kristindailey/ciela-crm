import type { Contact } from "../types/contact";

interface ContactCardProps {
    contact: Contact;
}

const ContactCard = ({ contact }: ContactCardProps) => {
    const formatTier = (tier: string) => {
        return tier
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/^\w/, c => c.toUpperCase());
    };

    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--royal-blue)] mb-2">
                {contact.firstName} {contact.lastName}
            </h3>

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