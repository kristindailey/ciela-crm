interface ListItemProps {
	id: string;
	text: string;
}

const ListItem = ({ id, text }: ListItemProps) => {
	return (
		<div>ListItem</div>
	);
};

export default ListItem;