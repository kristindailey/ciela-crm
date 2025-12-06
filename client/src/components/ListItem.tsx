import { useState } from "react";

interface ListItemProps {
	id?: string;
	value: string;
	placeholder?: string;
	onUpdate: (id: string | undefined, newValue: string) => void;
	onDelete: (id: string) => void;
}

const ListItem = ({ id, value, placeholder, onUpdate, onDelete }: ListItemProps) => {
	const [text, setText] = useState(value);

	return (
		<div className="flex items-center gap-2 mb-2">
			<input 
				type="text" 
				value={text}
				placeholder={placeholder}
				onChange={(e) => setText(e.target.value)}
				className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
			/>
		</div>
	);
};

export default ListItem;