interface UploadModalProps {
	isOpen: boolean;
	uploadType: string;
	onClose: () => void;
	onDownloadTemplate: () => void;
}

const UploadModal = ({ isOpen, uploadType, onClose, onDownloadTemplate }: UploadModalProps) => {
	if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
				<h2 className="text-xl font-semibold mb-4">Upload {uploadType}</h2>

				<button
					onClick={onDownloadTemplate}
					className="w-full mb-4 px-4 py-2 border-2 border-[var(--royal-blue)] text-[var(--royal-blue)] rounded hover:bg-[var(--royal-blue)] hover:text-white transition-colors"
				>
					Download CSV Template
				</button>

				<button 
					onClick={onClose}
					className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
				>
					Cancel
				</button>
			</div>
		</div>
    );
};

export default UploadModal;