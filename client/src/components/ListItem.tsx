import { useState, useEffect, forwardRef } from "react";

interface ListItemProps {
	id?: string;
	value: string;
	placeholder?: string;
	position?: number;
	onCreate: (newValue: string, position: number) => void;
	onChange: (id: string, newValue: string) => void;
	onDelete: (id: string) => void;
	onFocusNext?: () => void;
}

const ListItem = forwardRef<HTMLInputElement, ListItemProps>(({ id, value, placeholder, position, onCreate, onChange, onDelete, onFocusNext }, ref) => {
	const [text, setText] = useState(value);

	const handleSave = () => {
		if (!id && text.trim()) {
			onCreate(text.trim(), position!);
			setText("");
			if (onFocusNext) {
				setTimeout(() => onFocusNext(), 0);
			}
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
				ref={ref}
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
				className="flex-1 px-3 py-2 border border-card-border rounded-lg text-primary"
			/>

			<button
				onClick={() => id && onDelete(id)}
				className="text-medium font-medium text-[var(--heading)] hover:text-danger hover:font-normal transition-colors"
				disabled={!id}
			>
				X
			</button>
		</div>
	);
});

export default ListItem;