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
		<div>List</div>
	);
};

export default List;