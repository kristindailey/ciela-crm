import { useState, useEffect } from "react";

interface ListItemProps {
	id?: string;
	value: string;
	placeholder?: string;
	onCreate: (newValue: string) => void;
	onChange: (id: string, newValue: string) => void;
	onDelete: (id: string) => void;
}

const ListItem = ({ id, value, placeholder, onCreate, onChange, onDelete }: ListItemProps) => {
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
					if (id && text !== value) {
						onChange(id, text);
					}
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						if (!id && text.trim()) {
							onCreate(text.trim());
							setText("");
						} else if (id && text !== value) {
							onChange(id, text);
						}
					}
				}}
				className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black"
			/>

			<button
				onClick={() => id && onDelete(id)}
				className="text-medium text-[var(--royal-blue)] hover:text-red-600 transition-colors"
				disabled={!id}
			>
				X
			</button>
		</div>
	);
};

export default ListItem;