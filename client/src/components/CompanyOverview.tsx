import type { Company } from "../types/company";
import InfoPill from "../components/InfoPill";
import NotesSection from "../components/NotesSection";
import OutreachHistory from "../components/OutreachHistory";

interface CompanyOverviewProps {
	company: Company;
	onSaveDescription: (value: string) => void;
	onSaveHQLocation: (value: string) => void;
	onSaveEmployeeCount: (value: number) => void;
	onSaveDate: (value: string) => void;
	onSaveLocalLocation: (value: string) => void;
	onSaveGlassdoorRating: (value: number) => void;
    onSaveBlindRating: (value: number) => void;
	onSaveOfficePolicy: (value: string) => void;
	onSaveTechStack: (value: string) => void;
	onSaveCompanyNotes: (value: string) => void;
}

const CompanyOverview = ({ 
	company,
	onSaveDescription,
	onSaveHQLocation,
	onSaveEmployeeCount,
	onSaveDate,
	onSaveLocalLocation,
	onSaveGlassdoorRating,
	onSaveBlindRating,
	onSaveOfficePolicy,
	onSaveTechStack,
	onSaveCompanyNotes,
}: CompanyOverviewProps) => {
	const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    };

    const formatEmployeeCount = (count: number | null | undefined) => {
        if (!count) return;

        return count.toLocaleString();
    };

    const formatOfficePolicy = (policy: string | undefined) => {
        if (!policy) return undefined;
        const formatted = policy.toLowerCase().replace("_", "-");
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

	return (
		<>
			<div className="grid grid-cols-4 gap-4 px-5 mt-5">
                <InfoPill 
                    label="Description"
                    value={company.description}
                    placeholder="Add description"
                    onSave={onSaveDescription}
                />
                <InfoPill 
                    label="HQ Location"
                    value={company.hqLocation}
                    placeholder="Add HQ location"
                    onSave={onSaveHQLocation}
                />
                <InfoPill 
                    label="Employee Count"
                    value={formatEmployeeCount(company.employeeCount)}
                    placeholder="Add employee count"
                    onSave={(newValue) => {
                        const cleanValue = newValue.replace(/,/g, "");
                        onSaveEmployeeCount(parseInt(cleanValue, 10));
                    }}
                />
                <InfoPill 
                    label="Last Contacted"
                    value={company.updatedAt ? formatDate(company.updatedAt) : undefined}
                    placeholder="Not yet contacted"
                    onSave={onSaveDate}
                />
            </div>

            <div className="grid grid-cols-4 gap-4 px-5 mt-5">
                <div className="grid grid-cols-2 gap-3">
                    <InfoPill 
                        label="Glassdoor Rating"
                        value={company.glassdoorRating?.toString()}
                        placeholder="Add rating"
                        onSave={(newValue) => {
                            const rating = parseFloat(newValue);
                            if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                                onSaveGlassdoorRating(rating);
                            }
                        }}
                    />

                    <InfoPill
                        label="Blind Rating"
                        value={company.blindRating?.toString()}
                        placeholder="Add rating"
                        onSave={(newValue) => {
                            const rating = parseFloat(newValue);
                            if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                                onSaveBlindRating(rating);
                            }
                            }}
                    />
                </div>

                <InfoPill 
                    label="Office Policy"
                    value={formatOfficePolicy(company.officePolicy)}
                    placeholder="Add office policy"
                    dropdownOptions={["Remote", "Hybrid", "In-Office"]}
                    onSave={(newValue) => {
                            const policyMap: Record<string, string> = {
                                "Remote": "REMOTE",
                                "Hybrid": "HYBRID",
                                "In-Office": "IN_OFFICE",
                            };
                            onSaveOfficePolicy(policyMap[newValue]);
                        }}
                />

                <InfoPill 
                    label="Local Location"
                    value={company.localLocation}
                    placeholder="Add local location"
                    onSave={onSaveLocalLocation}
                />

            	<InfoPill 
                    label="Tech Stack"
                    value={company.techStack}
                    placeholder="Add tech stack"
                    onSave={onSaveTechStack}
                />
        	</div>

        	<div className="grid grid-cols-4 gap-4 px-5 mt-5">
            	<div className="col-span-2">
                	<NotesSection 
                		label="Company Notes"
                    	value={company.notes}
                    	placeholder="Add company notes"
                    	onSave={onSaveCompanyNotes}
                	/>
            	</div>
                    
            	<div className="col-span-2">
                	<OutreachHistory 
                    	label="Outreach History"
                    	placeholder="Add outreach history"
                	/>
            	</div>
        	</div>
		</>
	);
}

export default CompanyOverview;