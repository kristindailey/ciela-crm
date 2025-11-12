import type { Interaction } from "../types/interaction";

interface InteractionCardProps {
	interaction: Interaction;
}

const InteractionCard = ({ interaction }: InteractionCardProps) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

    return (
        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
			<div className="flex justify-between items-start mb-2">
				<span className="text-xs font-semibold text-[var(--royal-blue)] uppercase">
					{interaction.type}
				</span>

				<span className="text-xs text-gray-500">
					{formatDate(interaction.interactionDate)}
				</span>
			</div>

			{interaction.message && (
				<div className="font-sm text-sm text-gray-800 mb-1">
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