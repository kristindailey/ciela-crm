import { useState, useEffect } from "react";

interface ListItemProps {
	id?: string;
	value: string;
	placeholder?: string;
	onUpdate: (id: string | undefined, newValue: string) => void;
	onDelete: (id: string) => void;
}

const ListItem = ({ id, value, placeholder, onUpdate, onDelete }: ListItemProps) => {
	const [text, setText] = useState(value);

	useEffect(() => {
		setText(value);
	}, [value]);

	return (
		<div className="flex items-center gap-2 mb-2">
			<input 
				type="text" 
				value={text}
				placeholder={placeholder}
				onChange={(e) => setText(e.target.value)}
				onBlur={() => {
					if (text !== value) {
						onUpdate(id, text);
					}
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						if (text.trim() !== value) {
							onUpdate(id, text.trim());
						}
					}
				}}
				className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
			/>

			<button
				onClick={() => id && onDelete(id)}
				className="text-gray-400 hover:text-red-600 transition-colors"
				disabled={!id}
			>
				X
			</button>
		</div>
	);
};

export default ListItem;