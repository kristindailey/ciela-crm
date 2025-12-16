import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Application } from "../types/application";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa6";
import { FaFileAlt, FaFile } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Icon from "./Icon";

interface ContactCardProps {
	application: Application;
	onUpdateApplication: (updatedApplication: Application) => void;
	onDelete: () => void;
}

const ApplicationCard = ({ application, onUpdateApplication, onDelete }: ContactCardProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editingField, setEditingField] = useState<string | null>(null);
	const [tempValue, setTempValue] = useState<string>("");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();
	const iconLinks = [
		{ url: application.resumeUrl, icon: FaFileAlt, label: "resumeUrl" },
		{ url: application.coverLetterUrl, icon: FaFile, label: "coverLetterUrl" },
		{ url: application.projectDocsUrl, icon: FaFolderOpen, label: "projectDocsUrl" },
	];

	const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split("T")[0].split("-");
		const date = new Date(Number(year), Number(month) - 1, Number(day));

        return date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    };

	const formatTier = (tier: string) => {
        return tier
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/^\w/, c => c.toUpperCase());
    };

	const handleJobTitleUpdate = async (newJobTitle: string) => {
		if (newJobTitle === application.jobTitle) {
			setEditingField(null);
			return;
		}

		setEditingField(null);
		const updatedApplication = { ...application, jobTitle: newJobTitle };
		onUpdateApplication(updatedApplication);

		try {
			await fetch(`${API_BASE_URL}/applications/${application.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ jobTitle: newJobTitle }),
				credentials: "include",
			});
		} catch (error) {
			console.error("Failed to update job title:", error);
			onUpdateApplication(application);
		}
	};

	const handleStatusUpdate = async (newStatus: Application["status"]) => {
		if (newStatus === application.status) {
			setEditingField(null);
			return;
		}

		setEditingField(null);
		const updatedApplication = { ...application, status: newStatus };
		onUpdateApplication(updatedApplication);

		try {
			await fetch(`${API_BASE_URL}/applications/${application.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
				credentials: "include",
			});
		} catch (error) {
			console.error("Failed to update status:", error);
			onUpdateApplication(application);
		}
	};
	
	const handleAppliedDateUpdate = async (newDateString: string) => {
		const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
		const match = newDateString.match(dateRegex);

		if (!match) {
			setEditingField(null);
			return;
		}

		const [, month, day, year] = match;
		const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

		if (isNaN(parsedDate.getTime())) {
			setEditingField(null);
			return;
		}

		const isoDateString = parsedDate.toISOString();

		if (isoDateString === application.appliedDate) {
			setEditingField(null);
			return;
		}

		setEditingField(null);
		const updatedApplication = { ...application, appliedDate: isoDateString };
		onUpdateApplication(updatedApplication);

		try {
			await fetch(`${API_BASE_URL}/applications/${application.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ appliedDate: isoDateString }),
				credentials: "include",
			});
		} catch (error) {
			console.error("Failed to update applied date:", error);
			onUpdateApplication(application);
		}
	};

	const handleNotesUpdate = async (newNotes: string) => {
		if (newNotes === application.notes || "") {
			setEditingField(null);
			return;
		}

		setEditingField(null);
		const updatedApplication = { ...application, notes: newNotes } as Application;
		onUpdateApplication(updatedApplication);

		try {
			await fetch(`${API_BASE_URL}/applications/${application.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ notes: newNotes }),
				credentials: "include",
			});
		} catch (error) {
			console.error("Failed to update notes:", error);
			onUpdateApplication(application);
		}
	};

	const handleDocumentUrlUpdate = async (field: string, newUrl: string) => {
		const updatedApplication = {...application, [field]: newUrl};
		onUpdateApplication(updatedApplication);

		try {
			await fetch(`${API_BASE_URL}/applications/${application.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ [field]: newUrl }),
				credentials: "include",
			});
		} catch (error) {
			console.error(`Failed to update ${field}:`, error);
			onUpdateApplication(application);
		}
	};

	const handleCompanyClick = () => {
		if (application.company) {
			navigate(`/companies/${application.company.id}`);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};
		
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsDropdownOpen(false);
			}
		};
		
		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleEscape);
		}
		
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isDropdownOpen]);

	return (
		<div 
            className="flex flex-col relative bg-white p-4 rounded-lg border shadow-sm min-h-[162px]"
        >
            <div className="flex items-center justify-between">
				{editingField === "jobTitle" ? (
					<input
						type="text"
						value={tempValue}
						onChange={(e) => setTempValue(e.target.value)}
						onBlur={() => handleJobTitleUpdate(tempValue)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleJobTitleUpdate(tempValue);
							}
						}}
						autoFocus
						className="text-lg font-semibold text-[var(--royal-blue)] focus:outline-none w-full leading-tight"
					/>
				) : (
					<h3 
						onClick={() => {
							setEditingField("jobTitle");
							setTempValue(application.jobTitle || "");
						}}
						className="text-lg font-semibold text-[var(--royal-blue)] leading-tight"
					>
                    	{application.jobTitle}
                	</h3>
				)}

                {application.company.logoUrl && (
                    <img 
                        src={application.company.logoUrl} 
                        alt={`${application.company.name} logo`}
                        className="h-10 max-w-16 object-contain mr-6"
                    />
                )}
            </div>
			
			<div>
				<span 
					onClick={handleCompanyClick}
					className="text-sm text-gray-600 font-medium hover:text-[var(--soft-lavender)] cursor-pointer"
				>
					{application.company.name}
				</span>
			</div>

            <div className="mt-2">
                {editingField === "status" ? (
					<select 
						value={tempValue}
						onChange={(e) => setTempValue(e.target.value)}
						onBlur={() => handleStatusUpdate(tempValue as Application["status"])}
						autoFocus
						className="text-xs text-gray-700 px-1 py-1 rounded bg-[var(--soft-lavender)] focus:outline-none leading-tight"
					>	
						<option value="APPLIED">APPLIED</option>
						<option value="PHONE_SCREEN">PHONE SCREEN</option>
						<option value="TECHNICAL">TECHNICAL</option>
						<option value="ONSITE">ONSITE</option>
						<option value="OFFER">OFFER</option>
						<option value="REJECTED">REJECTED</option>
						<option value="WITHDRAWN">WITHDRAWN</option>
					</select>
				) : (
					<span
						onClick={(e) => {
							e.stopPropagation();
							setEditingField("status");
							setTempValue(application.status)
						}}
						className="inline-block text-xs text-gray-700 px-2 py-1 rounded bg-[var(--soft-lavender)] cursor-pointer hover:bg-[var(--soft-lavender)]/80 leading-tight"
					>
						{application.status.replace(/_/g, " ")}
					</span>
				)}
            </div>
			
			<div className="mt-2">
				<span className="text-xs text-gray-700 bg-[var(--cream-moon)] rounded-sm p-1">
					Applied: {editingField === "appliedDate" ? (
						<input
							type="text"
							size={9}
							value={tempValue}
							onChange={(e) => setTempValue(e.target.value)}
							onBlur={() => handleAppliedDateUpdate(tempValue)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAppliedDateUpdate(tempValue);
								}
							}}
							autoFocus
							placeholder="MM/DD/YYYY"
							className="text-xs text-gray-700 bg-[var(--cream-moon)] rounded-sm p-1 focus:outline-none"
						/>
					) : (
						<span 
							onClick={(e) => {
								e.stopPropagation();
								setEditingField("appliedDate");
								setTempValue(formatDate(application.appliedDate))
							}}
							className="text-xs text-gray-700 bg-[var(--cream-moon)] rounded-sm p-1"
						>
							{formatDate(application.appliedDate)}
						</span>
					)}
				</span>
			</div>

			<div className="mt-2">
				<textarea 
					value={editingField === "notes" ? tempValue : (application.notes || "")}
					readOnly={editingField !== "notes"}
					onClick={(e) => {
						e.stopPropagation();
						if (editingField !== "notes") {
							setEditingField("notes");
							setTempValue(application.notes || "");
						}
					}}
					onBlur={() => handleNotesUpdate(tempValue)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleNotesUpdate(tempValue);
						}
					}}
					onChange={(e) => setTempValue(e.target.value)}
					placeholder="Click to add notes..."
					className="block text-xs text-gray-600 px-1 py-1 focus:outline-none resize-none w-full"
				/>
			</div>

			<div className="flex gap-4 mb-3">
				{iconLinks.map(({ url, icon, label }) => (
                    <Icon 
                        key={label}
                        url={url}
                        icon={icon}
                        label={label}
						size={16}
                        onSave={(newValue) => handleDocumentUrlUpdate(label, newValue)}
                    />
                ))}
			</div>

            <div className="mt-auto">
                <span className="text-xs px-2 py-1 rounded bg-[var(--blush-pink)] text-gray-700">
					{formatTier(application.company.tier)}
				</span>
            </div>

            <div className="absolute top-2 right-2" ref={dropdownRef}>
                <div 
                    onClick={(e) => {
						e.stopPropagation();
						setIsDropdownOpen(!isDropdownOpen);
					}}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-500 hover:text-gray-50 shadow-md transition-colors cursor-pointer"
                >
                    <BsThreeDotsVertical size={18} />
                </div>

                {isDropdownOpen && 
                    <DropdownMenu 
                        itemType="Application"
                        onDeleteClick={() => {
                            setIsDeleteModalOpen(true);
                            setIsDropdownOpen(false);
                        }} 
                    />
                }
            </div>

			<DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                itemName={`the application for ${application.jobTitle} at ${application.company.name}`}
                itemType="Application"
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onDelete();
                    setIsDeleteModalOpen(false);
                }}
            />
        </div>
	);
};

export default ApplicationCard;