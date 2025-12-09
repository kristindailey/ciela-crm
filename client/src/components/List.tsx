import ListItem from "./ListItem";

interface Item {
	id?: string;
	text: string;
	position?: number;
}

interface ListProps {
	title: string;
	items: Item[];
	minRows?: number; 
	itemPlaceholder?: string;
	isLoading?: boolean;
	onCreate: (text: string, position?: number) => void;
	onChange: (id: string, newValue: string) => void;
	onDelete: (id: string) => void;
	onClearAll: () => void;
}

const List = ({ title, items, minRows, itemPlaceholder, isLoading, onCreate, onChange, onDelete, onClearAll }: ListProps) => {
	let displayItems = [...items];

	if (minRows) {
		while (displayItems.length < minRows) {
			displayItems.push({ text: "" });
		}

		if (displayItems.every((item) => item.id)) {
			displayItems.push({ text: "" });
		}
	} else {
		displayItems = items;
	}

	return (
		<div className="flex flex-col bg-white rounded-xl shadow-md p-4 max-h-[30vh] overflow-y-auto">
			<div className="flex justify-between items-center mb-4 font-inter">
				<h2 className="text-medium font-semibold text-[var(--royal-blue)]">{title}</h2>

				<button
					onClick={onClearAll}
					className="text-sm text-red-500 hover:text-red-700"
				>
					Clear All
				</button>
			</div>

			<div>
				{isLoading ? (
					<div className="flex justify-center text-gray-500 text-sm">Loading...</div>
				) : (
					displayItems.map((item, index) => (
						<ListItem
							key={item.id || `empty-${index}`}
							id={item.id}
							value={item.text}
							position={item.position}
							placeholder={itemPlaceholder || "Add new item..."}
							onCreate={onCreate}
							onChange={onChange}
							onDelete={onDelete}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default List;