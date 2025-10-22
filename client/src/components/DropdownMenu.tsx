interface DropdownMenuProps {
    onDelete: () => void;
}

const DropdownMenu = ({ onDelete }: DropdownMenuProps) => {
	return (
		<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-gray-200 py-1 z-50">
            <button
                onClick={() => {
                    if (window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
                        onDelete();
                    }
                }}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
            >
                Delete Company
            </button>
        </div>
	);
};

export default DropdownMenu;