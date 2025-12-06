import ListItem from "./ListItem";

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
	const displayItems = [...items];

	if (maxItems) {
		while (displayItems.length < maxItems) {
			displayItems.push({ text: "" });
		}
	} else {
		displayItems.push({ text: "" });
	}


	return (
		<div className="flex flex-col bg-white border border-gray-300 rounded-lg p-4">
			<div className="flex justify-between items-center mb-4 font-inter">
				<h2 className="text-xl font-semibold">{title}</h2>

				<button
					onClick={onClearAll}
					className="text-sm text-red-600 hover:text-red-700"
				>
					Clear All
				</button>
			</div>

			<div>
				{displayItems.map((item, index) => (
					<ListItem
						key={item.id || `empty-${index}`}
						id={item.id}
						value={item.text}
						placeholder={index === items.length ? "Add new item..." : undefined}
						onUpdate={onUpdate}
						onDelete={onDelete}
					/>
				))}
			</div>
		</div>
	);
};

export default List;