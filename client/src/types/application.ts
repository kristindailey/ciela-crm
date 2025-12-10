export interface Application {
    id: string;
	status: "APPLIED" | "PHONE_SCREEN" | "TECHNICAL" | "ONSITE" | "OFFER" | "REJECTED" | "WITHDRAWN";
	appliedDate: string;
	jobTitle?: string;
	notes?: string;
	resumeUrl?: string;
	coverLetterUrl?: string;
	projectDocsUrl?: string;
	hasReferral: boolean;
	referralSource?: string;
	referralNotes?: string;
    createdAt: string;
    updatedAt: string;

    // Relations
    userId: string;
	jobId?: string;
	companyId: string;
	company: {
		id: string;
		name: string;
		tier: string;
		logoUrl?: string;
	};
}