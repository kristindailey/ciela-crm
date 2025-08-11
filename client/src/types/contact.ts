export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    role?: string;
    linkedin?: string;
    bluesky?: string;
    github?: string;
    website?: string;
    location?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    
    // Relations
    userId: string;
    companyId: string;
    company: {
        id: string;
        name: string;
        tier: string;
        logoUrl?: string;
    }
}