export interface Interaction {
    id: string;
    type: "EMAIL" | "PHONE" | "MEETING" | "MEETUP" | "LINKEDIN" | "BLUESKY" | "OTHER";
    subject?: string;
    message: string;
    followUpDate?: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    
    // Relations
    userId: string;
    contactId: string;
}