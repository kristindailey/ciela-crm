import { useRef, useEffect } from "react";

interface UploadModalProps {
	isOpen: boolean;
	uploadType: string;
	uploadStatus?: {
		isProcessing: boolean;
		imported: number;
		skipped: number;
		errors: number;
	} | null;
	onClose: () => void;
	onDownloadTemplate: () => void
	onUpload: (fie: File) => void;
}

const UploadModal = ({ isOpen, uploadType, uploadStatus, onClose, onDownloadTemplate, onUpload }: UploadModalProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			onUpload(file);
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
	}, [isOpen, onClose]);

	if (!isOpen) return null;

    return (
        <div 
			onClick={onClose}
			className="fixed inset-0 flex items-center justify-center z-50"
		>
			<div 
				onClick={(e) => e.stopPropagation()}
				className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl font-inter border-3 border-gray-300"
			>
				<h2 className="text-xl font-bold text-gray-900 mb-4">Upload {uploadType}</h2>

				{uploadStatus && (
					<div className="mb-4 p-4 bg-gray-100 rounded">
						{uploadStatus.isProcessing? (
							<p className="text-gray-600">Processing...</p>
						) : (
							<div className="text-sm font-semibold">
								<p className="text-green-600">Imported: {uploadStatus.imported}</p>
								<p className="text-yellow-600">Skipped: {uploadStatus.skipped}</p>
								<p className="text-red-600">Errors: {uploadStatus.errors}</p>
							</div>
						)}
					</div>
				)}

				<button
					onClick={onDownloadTemplate}
					className="w-full mb-4 px-4 py-2 text-white bg-[var(--royal-blue)] rounded hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-color"
				>
					Download CSV Template
				</button>

				<input
					ref={fileInputRef}
					type="file"
					accept=".csv"
					onChange={handleFileSelect}
					className="hidden"
				/>

				<button
					onClick={() => fileInputRef.current?.click()}
					disabled={uploadStatus?.isProcessing}
					className="w-full mb-4 px-4 py-2 text-white bg-[var(--royal-blue)] rounded hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-color disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--royal-blue)] disabled:hover:text-white"
				>
					{uploadStatus?.isProcessing ? "Processing..." : "Select CSV File"}
				</button>

				<button 
					onClick={onClose}
					className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
				>
					Cancel
				</button>
			</div>
		</div>
    );
};

export default UploadModal;