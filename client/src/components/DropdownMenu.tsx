interface DropdownMenuProps {
    itemType: string;
    onDeleteClick: () => void;
}

const DropdownMenu = ({ onDeleteClick, itemType }: DropdownMenuProps) => {
	return (
		<div className="absolute -right-2 top-full mt-2 w-48 bg-card rounded-lg border border-card-border z-50 font-inter">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick();
                }}
                className="w-full px-4 py-3 text-left text-danger hover:bg-dropdown-menu-hover transition-colors rounded-t-lg"
            >
                Delete {itemType}
            </button>
        </div>
	);
};

export default DropdownMenu;