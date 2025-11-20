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

	const handleContactClick = () => {
		if (reminder.contact) {
			navigate(`/contacts/${reminder.contact.id}`);
		}
	};

    return (
        <div
            className="flex flex-col relative bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30 transition-all h-[162px]"
        >
            <div className="flex items-center justify-between">
				<div className="flex-1">
					<h3 
						onClick={handleContactClick}
						className="text-lg font-semibold text-[var(--royal-blue)]"
					>
                    	{reminder.contact?.firstName} {reminder.contact?.lastName}
                	</h3>

					<span className="text-sm text-gray-600 font-medium">
						{reminder.contact?.company?.name} · {reminder.contact?.company?.tier}
					</span>

					<span className="text-sm text-gray-600 font-medium">
						{reminder.type}
					</span>

					<p className="text-sm text-gray-600 font-medium">
						{reminder.subject || reminder.message}
					</p>

					<div className="flex gap-4 mt-3 text-xs text-gray-500">
						<span>Interaction: {formatDate(reminder.interactionDate)}</span>
						<span>Follow-up: {reminder.followUpDate && formatDate(reminder.followUpDate)}</span>
					</div>
				</div>
                
				<div className="flex gap-2 ml-4">
					<button
						onClick={() => onClear(reminder.id)}
						className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Clear
					</button>
					<button
						onClick={() => onSnooze(reminder.id)}
						className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
					>
						Snooze
					</button>
				</div>
            </div>
        </div>
    );
};

export default ReminderCard;