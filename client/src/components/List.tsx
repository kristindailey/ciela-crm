interface ListItem {
	id: string;
	text: string;
}

interface ListProps {
	title: string;
	items: ListItem[];
	maxItems?: number;
	placeholder?: string;
	onAdd: (text: string) => Promise<void>;
	onUpdate: (id: string, text: string) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
	onClearAll: () => Promise<void>;
}

const List = ({ title, items, maxItems, placeholder, onAdd, onUpdate, onDelete, onClearAll }: ListProps) => {
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