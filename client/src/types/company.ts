export interface Company {
    id: string;
    name: string;
    website?: string;
    careersPage?: string;
    glassdoor?: string;
    linkedin?: string;
    bluesky?: string;
    github?: string;
    logoUrl?: string;
    description?: string;
    hqLocation?: string;
    localLocation?: string;
    employeeCount?: number;
    officePolicy?: string;
    techStack?: string[];
    notes?: string;
    tier: string;
    createdAt: string;
    updatedAt: string;

    // Relations
    userId: string;
}