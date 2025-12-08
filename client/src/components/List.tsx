import ListItem from "./ListItem";

interface Item {
	id?: string;
	text: string;
	position: number;
}

interface ListProps {
	title: string;
	items: Item[];
	onCreate: (text: string, positon: number) => void;
	onChange: (id: string, newValue: string) => void;
	onDelete: (id: string) => void;
	onClearAll: () => void;
}

const List = ({ title, items, onCreate, onChange, onDelete, onClearAll }: ListProps) => {
	const displayItems = items;

	return (
		<div className="flex flex-col bg-white rounded-xl shadow-md p-4">
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
				{displayItems.map((item, index) => (
					<ListItem
						key={item.id || `empty-${index}`}
						id={item.id}
						value={item.text}
						position={item.position}
						placeholder="Add new item..."
						onCreate={onCreate}
						onChange={onChange}
						onDelete={onDelete}
					/>
				))}
			</div>
		</div>
	);
};

export default List;