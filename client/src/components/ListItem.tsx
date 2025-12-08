import { useState, useEffect } from "react";

interface ListItemProps {
	id?: string;
	value: string;
	placeholder?: string;
	position?: number;
	onCreate: (newValue: string, position: number) => void;
	onChange: (id: string, newValue: string) => void;
	onDelete: (id: string) => void;
}

const ListItem = ({ id, value, placeholder, position, onCreate, onChange, onDelete }: ListItemProps) => {
	const [text, setText] = useState(value);

	const handleSave = () => {
		if (!id && text.trim()) {
			if (position) {
				onCreate(text.trim(), position);
			}
			setText("");
		} else if (id && text !== value) {
			onChange(id, text);
		}
	};

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
				onBlur={handleSave}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						handleSave();
					}
				}}
				className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black"
			/>

			<button
				onClick={() => id && onDelete(id)}
				className="text-medium font-medium text-[var(--royal-blue)] hover:text-red-500 hover:font-normal transition-colors"
				disabled={!id}
			>
				X
			</button>
		</div>
	);
};

export default ListItem;