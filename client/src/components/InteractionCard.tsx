import type { Interaction } from "../types/interaction";
import { FiEdit2 } from "react-icons/fi";

interface InteractionCardProps {
	interaction: Interaction;
	onEdit: (interaction: Interaction) => void;
}

const InteractionCard = ({ interaction, onEdit }: InteractionCardProps) => {
	const formatDate = (dateString: string) => {
		const [year, month, day] = dateString.split("T")[0].split("-");
		const date = new Date(Number(year), Number(month) - 1, Number(day));
		
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

    return (
        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
			<div className="flex justify-between items-start font-inter mb-2">
				<span className="text-xs font-bold text-[var(--royal-blue)] uppercase">
					{interaction.type}
				</span>

				<span className="text-xs text-gray-500">
					{formatDate(interaction.interactionDate)}
				</span>

				<button
					className="text-gray-400 hover:text-[var(--royal-blue)] transition-colors"
					aria-label="Edit interaction"
					onClick={() => onEdit(interaction)}
				>
					<FiEdit2 size={14} />
				</button>
			</div>

			{interaction.subject && (
				<div className="text-sm text-black mb-1">
					{interaction.subject}
				</div>
			)}

			{interaction.message && (
				<div className="text-sm text-black mb-1">
					{interaction.message}
				</div>
			)}

			{interaction.followUpDate && (
				<div className="text-xs text-gray-500 mt-2">
					Follow-up: {formatDate(interaction.followUpDate)}
				</div>
			)}
		</div>
    );
};

export default InteractionCard;