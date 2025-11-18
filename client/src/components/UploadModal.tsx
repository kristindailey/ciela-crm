interface UploadModalProps {
	isOpen: boolean;
	uploadType: string;
	onClose: () => void;
	onDownloadTemplate: () => void;
}

const UploadModal = ({ isOpen, uploadType, onClose, onDownloadTemplate }: UploadModalProps) => {
	if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl font-inter border-3 border-gray-300">
				<h2 className="text-xl font-bold text-gray-900 mb-4">Upload {uploadType}</h2>

				<button
					onClick={onDownloadTemplate}
					className="w-full mb-4 px-4 py-2 text-white bg-[var(--royal-blue)] rounded hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-color"
				>
					Download CSV Template
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