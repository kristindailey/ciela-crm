import { useEffect } from "react";

interface AddInteractionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const AddInteractionModal = ({ isOpen, onClose, onConfirm }: AddInteractionModalProps) => {
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
		<div>AddInteractionModal</div>
	);
};

export default AddInteractionModal;