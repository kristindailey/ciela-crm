export interface Interaction {
    id: string;
    type: "EMAIL" | "PHONE" | "MEETING" | "MEETUP" | "LINKEDIN" | "BLUESKY" | "OTHER";
    subject?: string;
    message: string;
    interactionDate: string;
    followUpDate?: string | null;
    contact?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    createdAt: string;
    updatedAt: string;
    
    // Relations
    userId: string;
    contactId: string;
}