import { useState, useEffect } from "react";
import { Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DateSegment, Dialog, Group, Heading, Popover } from "react-aria-components";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarDate, parseDate } from "@internationalized/date";
import type { Interaction } from "../types/interaction";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface InteractionModalProps {
	isOpen: boolean;
	contactId: string;
	companyId?: string;
	editingInteraction?: Interaction | null;
	onClose: () => void;
	onConfirm: (interaction: any) => void;
}

const InteractionModal = ({ isOpen, contactId, companyId, editingInteraction, onClose, onConfirm }: InteractionModalProps) => {
	const [error, setError] = useState<string>("");
	const [selectedInteractionType, setSelectedInteractionType] = useState<Interaction["type"] | "">("");
	const [subject, setSubject] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [interactionDate, setInteractionDate] = useState<CalendarDate | null>(null);
	const [followUpDate, setFollowUpDate] = useState<CalendarDate | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [contacts, setContacts] = useState<Array<{id: string, name: string}>>([]);
	const [selectedContactId, setSelectedContactId] = useState<string>("");
	const [isLoadingContacts, setIsLoadingContacts] = useState(false);
	const interactionTypes: Interaction["type"][] = ["EMAIL", "PHONE", "MEETING", "MEETUP", "LINKEDIN", "BLUESKY", "OTHER"] as const;
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const formatInteractionType = (type: string | undefined) => {
        if (!type) return undefined;

		if (type === "linkedin" || type === "LINKEDIN") {
			return "LinkedIn";
		}

        const formatted = type.toLowerCase();
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

	const handleInteractionTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value as Interaction["type"] | "";
		setSelectedInteractionType(value);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedInteractionType) {
			setError("Please set an interaction type.");
			return;
		}

		if (!message.trim()) {
			setError("Please enter a message.");
			return;
		}

		if (!interactionDate) {
			setError("Please select an interaction date.");
			return;
		}

		if (companyId && !selectedContactId) {
			setError("Please select a contact.");
			return;
		}

		try {
			const url = editingInteraction
				? `${API_BASE_URL}/interactions/${editingInteraction.id}`
				: `${API_BASE_URL}/interactions`;
			
			const method = editingInteraction ? "PATCH" : "POST";

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					type: selectedInteractionType,
					subject: subject || null,
					message,
					interactionDate: interactionDate ? interactionDate.toString() : null,
					followUpDate: followUpDate ? followUpDate.toString() : null,
					contactId: companyId ? selectedContactId : contactId,
				}),
			});

			if (!response.ok) {
				throw new Error(editingInteraction ? "Failed up to update interaction." : "Failed to create interaction.");
			}

			const updatedInteraction = await response.json();

			if (companyId && selectedContactId) {
				const selectedContact = contacts.find((contact) => contact.id === selectedContactId);

				if (selectedContact) {
					const [firstName, ...lastNameParts] = selectedContact.name.split(" ");
					updatedInteraction.contact = {
						id: selectedContactId,
						firstName,
						lastName: lastNameParts.join(" "),
					};
				}
			}

			onConfirm(updatedInteraction);
		} catch (error) {
			console.error("Error saving interaction:", error);
			setError(editingInteraction ? "Failed to update interaction. Please try again." : "Failed to create interaction. Please try again.");
		}
	};

	const handleDelete = async () => {
		if (!editingInteraction) return;

		try {
			const response = await fetch(`${API_BASE_URL}/interactions/${editingInteraction.id}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to delete interaction.");
			}

			setIsDeleteModalOpen(false);
			onConfirm({ deleted: true, id: editingInteraction.id });
		} catch (error) {
			console.error("Error deleting interaction:", error);
			setError("Failed to delete interaction. Please try again.");
		}
	};

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose, onConfirm]);

	useEffect(() => {
		if (editingInteraction) {
			setSelectedInteractionType(editingInteraction.type);
			setSubject(editingInteraction.subject || "");
			setMessage(editingInteraction.message);
			setSelectedContactId(editingInteraction.contactId);
			setInteractionDate(parseDate(editingInteraction.interactionDate.split("T")[0]));
			setFollowUpDate(editingInteraction.followUpDate ? parseDate(editingInteraction.followUpDate.split("T")[0]) : null);
		} else {
			setSelectedInteractionType("");
			setSubject("");
			setMessage("");
			setSelectedContactId("");
			setInteractionDate(null);
			setFollowUpDate(null);
		}
		setIsDeleteModalOpen(false);
	}, [editingInteraction]);

	useEffect(() => {
		if (!companyId || !isOpen) return;

		const fetchContacts = async () => {
			setIsLoadingContacts(true);

			try {
				const response = await fetch(`${API_BASE_URL}/companies/${companyId}/contacts`, {
					credentials: "include",
				});

				if (response.ok) {
					const contactsData = await response.json();
					setContacts(contactsData.map((contact: any) => ({ 
						id: contact.id, 
						name: `${contact.firstName} ${contact.lastName}`.trim(),
					})));
				}
			} catch (error) {
				console.error("Error fetching contacts:", error);
			} finally {
				setIsLoadingContacts(false);
			}
		};

		fetchContacts();
	}, [companyId, isOpen, API_BASE_URL]);

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
				className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl font-inter border-3 border-gray-300 text-black"
			>
				<h2 className="text-xl font-bold mb-2">
					{editingInteraction ? "Edit Interaction" : "Add Interaction"}
				</h2>

				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mt-5 mb-5">
						<label htmlFor="type" className="block text-sm font-medium mb-1">
							Type
						</label>

						<select 
							name="type" 
							id="type"
							value={selectedInteractionType}
							onChange={handleInteractionTypeSelect}
							className="w-full px-2 py-2 border border-2 border-[var(--royal-blue)] rounded-md" 
						>
							<option value="">Choose an interaction type...</option>
							{interactionTypes.map((type) => (
								<option key={type} value={type}>
									{formatInteractionType(type)}
								</option>
							))}
						</select>
					</div>

					{companyId && (
						<div className="mb-5">
							<label htmlFor="contact" className="block text-sm font-medium mb-1">
								Contact
							</label>

							{isLoadingContacts ? (
								<div className="text-gray-500 text-sm">Loading contacts...</div>
							) : (
								<select
									value={selectedContactId}
									onChange={(e) => setSelectedContactId(e.target.value)}
									className="w-full px-2 py-2 border border-2 border-[var(--royal-blue)] rounded-md"
								>
									<option value="">Choose a contact...</option>
									{contacts.map((contact) => (
										<option key={contact.id} value={contact.id}>
											{contact.name}
										</option>
									))}
								</select>
							)}
						</div>
					)}

					<div className="flex justify-between mb-5">
						<div>
							<label htmlFor="date" className="block text-sm font-medium mb-1">
								Date of Interaction
							</label>

							<DatePicker value={interactionDate} onChange={setInteractionDate} aria-label="Date of Interaction">
								<Group className="flex w-fit items-center border-2 border-[var(--royal-blue)] rounded-md px-2 py-2">
									<DateInput className="py-1 pr-10 pl-2">
										{(segment) => <DateSegment segment={segment} />}
									</DateInput>
									<Button className="bg-[var(--royal-blue)] text-white rounded ml-3 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors">
										<ChevronDown size={20} />
									</Button>
								</Group>
								<Popover className="max-w-none bg-white shadow-lg rounded-lg border border-2 border-[var(--royal-blue)] p-4 text-black">
									<Dialog>
										<Calendar>
											<header className="flex justify-center mb-5">
												<Button slot="previous" className="bg-[var(--royal-blue)] text-white rounded ml-3 mr-3 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors">
													<ChevronLeft size={20} />
												</Button>
												<Heading />
												<Button slot="next" className="bg-[var(--royal-blue)] text-white rounded ml-3 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors">
													<ChevronRight size={20} />
												</Button>
											</header>
											<CalendarGrid>
												{(date) => 
													<CalendarCell date={date} className="flex justify-center">
														{({ isOutsideMonth }) => (
															<span className={isOutsideMonth ? "text-gray-400" : "p-2 rounded-md hover:bg-[var(--royal-blue)] hover:text-white transition-colors duration-150"}>{date.day}</span>
														)}
													</CalendarCell>
												}
											</CalendarGrid>
										</Calendar>
									</Dialog>
								</Popover>
							</DatePicker>
						</div>

						<div>
							<label htmlFor="followupDate" className="block text-sm font-medium mb-1">
								Follow-Up Date (Optional)
							</label>

							<DatePicker value={followUpDate} onChange={setFollowUpDate} aria-label="Follow-Up Date">
								<Group className="flex w-fit items-center border-2 border-[var(--royal-blue)] rounded-md px-2 py-2">
									<DateInput className="py-1 pr-10 pl-2">
										{(segment) => <DateSegment segment={segment} />}
									</DateInput>
									<Button className="bg-[var(--royal-blue)] text-white rounded ml-3 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors">
										<ChevronDown size={20} />
									</Button>
								</Group>
								<Popover className="max-w-none bg-white shadow-lg rounded-lg border border-2 border-[var(--royal-blue)] p-4 text-black">
									<Dialog>
										<Calendar>
											<header className="flex justify-center mb-5">
												<Button slot="previous" className="bg-[var(--royal-blue)] text-white rounded ml-3 mr-3 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors">
													<ChevronLeft size={20} />
												</Button>
												<Heading />
												<Button slot="next" className="bg-[var(--royal-blue)] text-white rounded ml-3 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors">
													<ChevronRight size={20} />
												</Button>
											</header>
											<CalendarGrid>
												{(date) => 
													<CalendarCell date={date} className="flex justify-center">
														{({ isOutsideMonth }) => (
															<span className={isOutsideMonth ? "text-gray-400" : "p-2 rounded-md hover:bg-[var(--royal-blue)] hover:text-white transition-colors duration-150"}>{date.day}</span>
														)}
													</CalendarCell>
												}
											</CalendarGrid>
										</Calendar>
									</Dialog>
								</Popover>
							</DatePicker>
						</div>
					</div>

					<div className="mb-5">
						<label htmlFor="subject" className="block text-sm font-medium mb-1">
							Subject (Optional)
						</label>

						<input 
							type="text"
							id="subject"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className="w-full px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md" 
						/>
					</div>

					<div className="mb-5">
						<label htmlFor="message" className="block text-sm font-medium mb-1">
							Message/Notes
						</label>

						<textarea 
							id="message"
							name="message"
							rows={4}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full px-3 py-2 border border-2 border-[var(--royal-blue)] rounded-md resize-vertical" 
							required
						>
						</textarea>
					</div>

					<div className="flex justify-between gap-3">
						{editingInteraction && (
							<button
								type="button"
								onClick={() => setIsDeleteModalOpen(true)}
								className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
							>
								Delete
							</button>
						)}

						<div className="flex gap-3 ml-auto">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
							>
								Cancel
							</button>

							<button
								type="submit"
								className="px-4 py-2 text-white bg-[var(--royal-blue)] rounded-lg hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors"
							>
								{editingInteraction ? "Update" : "Add"}
							</button>
						</div>
					</div>
				</form>
			</div>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				itemName={"this interaction"}
				itemType="Interaction"
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
			/>
		</div>
	);
};

export default InteractionModal;