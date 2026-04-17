import { useState } from "react";
import { useNavigate } from "react-router";
import type { Interaction } from "../types/interaction";

interface ReminderCardProps {
	reminder: Interaction;
	onClear: (id: string) => void;
	onSnooze: (id: string) => void;
}

const ReminderCard = ({ reminder, onClear, onSnooze }: ReminderCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const navigate = useNavigate();

	const formatDate = (dateString: string) => {
		const [year, month, day] = dateString.split("T")[0].split("-");
		const date = new Date(Number(year), Number(month) - 1, Number(day));

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatInteractionType = (type: string | undefined) => {
		if (!type) return undefined;

		if (type === "linkedin" || type === "LINKEDIN") {
			return "LinkedIn";
		}

        const formatted = type.toLowerCase();
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	};

	const formatTier = (tier: string | undefined) => {
		if (!tier) return undefined;

    	return tier
      	.toLowerCase()
      	.replace(/_/g, " ")
      	.replace(/^\w/, c => c.toUpperCase());
  	};

	const handleContactClick = () => {
		if (reminder.contact) {
			navigate(`/contacts/${reminder.contact.id}`);
		}
	};

	const handleCompanyClick = () => {
		if (reminder.contact?.company) {
			navigate(`/companies/${reminder.contact.company.id}`);
		}
	};

    return (
        <div
            className="flex flex-col relative bg-card p-4 rounded-lg shadow-sm cursor-pointer font-inter"
        >
            <div className="flex items-center justify-between">
				<h3 
					onClick={handleContactClick}
					className="text-md font-semibold text-[var(--heading)] hover:text-[var(--lavender)]"
				>
                    {reminder.contact?.firstName} {reminder.contact?.lastName}
                </h3>

				<span className="text-xs text-muted">
					{formatDate(reminder.interactionDate)}
				</span>
			</div>

			<div className="flex items-center justify-between">
				<span 
					onClick={handleCompanyClick}
					className="text-sm font-medium text-muted hover:text-[var(--lavender)]"
				>
					{reminder.contact?.company?.name}
				</span>

				<span className="text-xs text-primary bg-[var(--lavender)] rounded-sm p-1">
					Due: {reminder.followUpDate && formatDate(reminder.followUpDate)}
				</span>
			</div>

			<hr className="border-[var(--divider)] mt-2 mb-2"/>

			<div className="flex items-center justify-between mb-1">
				<span className="text-xs text-muted font-medium">
					{formatInteractionType(reminder.type)}
				</span>

				<span className="text-xs text-muted font-medium">
					{formatTier(reminder.contact?.company?.tier)}
				</span> 
			</div>
			
			<span className="text-xs text-muted font-medium mt-1 min-h-[1.25rem]">
				{reminder?.subject}
			</span>

			<span 
				onClick={reminder.message && reminder.message.length > 75 ? () => setIsExpanded(!isExpanded) : undefined}
				className={`text-xs text-muted font-medium mt-1 ${reminder.message && reminder.message.length > 75 ? "cursor-pointer hover:text-primary" : ""}  ${isExpanded ? "" : "line-clamp-1"}`}
			>
				{reminder.message}
			</span>

			<div className="flex justify-end gap-2 mt-3">
				<button
					onClick={() => onClear(reminder.id)}
					className="px-3 py-2 text-primary text-sm bg-cancel rounded-lg hover:bg-cancel-hover transition-colors"
				>
					Clear
				</button>

				<button
					onClick={() => onSnooze(reminder.id)}
					className="px-3 py-2 text-white text-sm bg-[var(--sidebar)] rounded-lg hover:bg-[var(--lavender)] hover:text-[var(--heading)] transition-colors"
				>
					Snooze
				</button>
			</div>
        </div>
    );
};

export default ReminderCard;