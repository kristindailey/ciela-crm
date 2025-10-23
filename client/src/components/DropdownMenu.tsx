interface DropdownMenuProps {
    itemType: string;
    onDeleteClick: () => void;
}

const DropdownMenu = ({ onDeleteClick, itemType }: DropdownMenuProps) => {
	return (
		<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-gray-200 py-1 z-50">
            <button
                onClick={onDeleteClick}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
            >
                Delete {itemType}
            </button>
        </div>
	);
};

export default DropdownMenu;