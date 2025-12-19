import { useState } from "react";
import type { Company } from "../types/company";
import InfoPill from "../components/InfoPill";
import NotesSection from "../components/NotesSection";
import OutreachHistory from "../components/OutreachHistory";

interface CompanyOverviewProps {
	company: Company;
    lastContactedDate: string | null;
	onSaveDescription: (value: string) => void;
	onSaveHQLocation: (value: string) => void;
	onSaveEmployeeCount: (value: number) => void;
	onSaveLocalLocation: (value: string) => void;
	onSaveGlassdoorRating: (value: number) => void;
    onSaveBlindRating: (value: number) => void;
	onSaveOfficePolicy: (value: string) => void;
	onSaveTechStack: (value: string) => void;
	onSaveCompanyNotes: (value: string) => void;
    onInteractionAdded?: (interaction: any) => void;
}

const CompanyOverview = ({ 
	company,
    lastContactedDate,
	onSaveDescription,
	onSaveHQLocation,
	onSaveEmployeeCount,
	onSaveLocalLocation,
	onSaveGlassdoorRating,
	onSaveBlindRating,
	onSaveOfficePolicy,
	onSaveTechStack,
	onSaveCompanyNotes,
    onInteractionAdded
}: CompanyOverviewProps) => {
    const [searchQuery, setSearchQuery] = useState("");

	const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split("T")[0].split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));

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
					bgColor="bg-[var(--soft-lavender)]"
                />

                <InfoPill 
                    label="HQ Location"
                    value={company.hqLocation}
                    placeholder="Add HQ location"
                    onSave={onSaveHQLocation}
					bgColor="bg-[var(--cream-moon)]"
                />

                <InfoPill 
                    label="Employee Count"
                    value={formatEmployeeCount(company.employeeCount)}
                    placeholder="Add employee count"
                    onSave={(newValue) => {
                        const cleanValue = newValue.replace(/,/g, "");
                        onSaveEmployeeCount(parseInt(cleanValue, 10));
                    }}
					bgColor="bg-[var(--blush-pink)]"
                />
				
                <InfoPill 
                    label="Last Contacted"
                    value={lastContactedDate ? formatDate(lastContactedDate) : undefined}
                    placeholder="Not yet contacted"
                    onSave={() => {}}
                    readOnly={true}
					bgColor="bg-[var(--soft-lavender)]"
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
						bgColor="bg-[var(--cream-moon)]"
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
						bgColor="bg-[var(--blush-pink)]"
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
					bgColor="bg-[var(--soft-lavender)]"
                />

                <InfoPill 
                    label="Local Location"
                    value={company.localLocation}
                    placeholder="Add local location"
                    onSave={onSaveLocalLocation}
					bgColor="bg-[var(--cream-moon)]"
                />

            	<InfoPill 
                    label="Tech Stack"
                    value={company.techStack}
                    placeholder="Add tech stack"
                    onSave={onSaveTechStack}
					bgColor="bg-[var(--blush-pink)]"
                />
        	</div>

        	<div className="grid grid-cols-4 gap-4 px-5 mt-5 mb-5">
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
                        contactId={company.id}
                        companyId={company.id}
                        searchValue={searchQuery}
                        searchPlaceholder="Search interactions..."
                        onSearchChange={setSearchQuery}
                        onInteractionAdded={onInteractionAdded}
                	/>
            	</div>
        	</div>
		</>
	);
}

export default CompanyOverview;