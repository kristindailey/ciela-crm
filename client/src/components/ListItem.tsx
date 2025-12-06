interface ListItemProps {
	id?: string;
	value: string;
	placeholder?: string;
	onUpdate: (id: string | undefined, newValue: string) => void;
	onDelete: (id: string) => void;
}

const ListItem = ({ id, value, placeholder, onUpdate, onDelete }: ListItemProps) => {
	return (
		<div>ListItem</div>
	);
};

export default ListItem;