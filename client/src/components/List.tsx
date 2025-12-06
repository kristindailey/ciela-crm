interface Item {
	id?: string;
	text: string;
}

interface ListProps {
	title: string;
	items: Item[];
	maxItems?: number;
	onUpdate: (id: string | undefined, newValue: string) => void;
	onDelete: (id: string) => void;
	onClearAll: () => void;
}

const List = ({ title, items, maxItems, onUpdate, onDelete, onClearAll }: ListProps) => {
	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center mb-4 font-inter">
				<h2 className="text-xl font-semibold">{title}</h2>
				<button
					onClick={() => {}}
					className="text-sm text-red-600 hover:text-red-700"
				>
					Clear All
				</button>
			</div>
		</div>
	);
};

export default List;