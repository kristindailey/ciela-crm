import type { Interaction } from "../types/interaction";

interface ReminderCardProps {
	interaction: Interaction;
	onClear: (interactionId: string, contactId: string) => void;
	onSnooze: (interactionId: string) => void;
}

const ReminderCard = ({ interaction, onClear, onSnooze }: ReminderCardProps) => {
	const contactName = `${interaction.contact?.firstName} ${interaction.contact?.lastName}`;
	const companyName = interaction.contact?.company?.name || "No company";

    return (
        <div
            className="flex flex-col relative bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30 transition-all h-[162px]"
        >
            <div className="flex items-center justify-between">
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-[var(--royal-blue)]">
                    	{contactName} · {companyName}
                	</h3>

					<p className="text-sm text-gray-600 font-medium">
						{interaction.type} {interaction.subject && `. ${interaction.subject}`}
					</p>

					<p className="text-sm text-gray-600 font-medium">
						{interaction.message}
					</p>

					<div className="flex gap-4 mt-3 text-xs text-gray-500">
						<span>Interaction: {new Date(interaction.interactionDate).toLocaleDateString()}</span>
						<span>Follow-up: {new Date(interaction.followUpDate!).toLocaleDateString()}</span>
					</div>
				</div>
                
				<div className="flex gap-2 ml-4">
					<button
						onClick={() => onClear(interaction.id, interaction.contactId)}
						className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Clear
					</button>
					<button
						onClick={() => onSnooze(interaction.id)}
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