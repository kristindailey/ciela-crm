import { useEffect } from "react";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	itemName: string | undefined;
	itemType: string;
	onClose: () => void;
	onConfirm: () => void;
}

const DeleteConfirmationModal = ({ isOpen, itemName, itemType, onClose, onConfirm }: DeleteConfirmationModalProps) => {
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		const handleEnter = (event: KeyboardEvent) => {
			if (event.key === "Enter") {
				onConfirm();
			}
		}

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.addEventListener("keydown", handleEnter);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.removeEventListener("keydown", handleEnter);
		};
	}, [isOpen, onClose, onConfirm]);

	if (!isOpen) return null;
	
	return (
		<div 
			onClick={(e) => {
				e.stopPropagation();
				onClose();
			}}
			className="fixed inset-0 flex items-center justify-center z-50"
		>
			<div
				onClick={(e) => e.stopPropagation()} 
				className="bg-card rounded-lg p-6 max-w-md w-full mx-4 shadow-xl font-inter border-3 border-card-border"
			>
				<h2 className="text-xl font-bold text-primary mb-2">
					Delete {itemType}
				</h2>

				<p className="text-muted mb-6">
					Are you sure you want to delete <span className="font-semibold">{itemName}</span>? This action cannot be undone.
				</p>

				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 text-primary bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Cancel
					</button>

					<button
						onClick={onConfirm}
						className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmationModal;