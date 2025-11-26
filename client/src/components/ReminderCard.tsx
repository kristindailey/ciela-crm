import { useNavigate } from "react-router";
import type { Interaction } from "../types/interaction";

interface ReminderCardProps {
	reminder: Interaction;
	onClear: (id: string) => void;
	onSnooze: (id: string) => void;
}

const ReminderCard = ({ reminder, onClear, onSnooze }: ReminderCardProps) => {
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

    return (
        <div
            className="flex flex-col relative bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30 transition-all h-[180px]"
        >
            <div className="flex items-center justify-between">
				<h3 
					onClick={handleContactClick}
					className="text-lg font-semibold text-[var(--royal-blue)]"
				>
                    {reminder.contact?.firstName} {reminder.contact?.lastName}
                </h3>

				<span className="text-xs text-gray-500">
					Interaction: {formatDate(reminder.interactionDate)}
				</span>
			</div>

			<div className="flex items-center justify-between">
				<span className="text-sm text-gray-600 font-medium">
					{reminder.contact?.company?.name}
				</span>

				<span className="text-xs text-gray-500">
					Follow-up: {reminder.followUpDate && formatDate(reminder.followUpDate)}
				</span>
			</div>
			
			<span className="text-xs text-gray-500 font-medium">
				{formatInteractionType(reminder.type)}
			</span>

			<span className="text-xs text-gray-500 font-medium">
				{reminder?.subject}
			</span>

			<span className="text-xs text-gray-500 font-medium mb-3">
				{reminder.message}
			</span>

			<div className="flex items-center justify-between">
				<span className="text-sm text-gray-600 font-medium">
					{formatTier(reminder.contact?.company?.tier)}
				</span>

				<div className="flex justify-end gap-2">
					<button
						onClick={() => onClear(reminder.id)}
						className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Clear
					</button>

					<button
						onClick={() => onSnooze(reminder.id)}
						className="px-3 py-2 text-white bg-[var(--royal-blue)] rounded-lg hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors"
					>
						Snooze
					</button>
				</div>
			</div>	
        </div>
    );
};

export default ReminderCard;