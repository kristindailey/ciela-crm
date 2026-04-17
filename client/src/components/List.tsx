import { useRef } from "react";
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
	scrollable: boolean;
	onCreate: (text: string, position?: number) => void;
	onChange: (id: string, newValue: string) => void;
	onDelete: (id: string) => void;
	onClearAll: () => void;
}

const List = ({ title, items, minRows, itemPlaceholder, isLoading, scrollable, onCreate, onChange, onDelete, onClearAll }: ListProps) => {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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

	const focusNextItem = (currentIndex: number) => {
		const nextIndex = currentIndex + 1;
		if (nextIndex < inputRefs.current.length) {
			inputRefs.current[nextIndex]?.focus();
		}
	};

	return (
		<div className={`flex flex-col bg-card rounded-xl shadow-md p-4 min-h-[30vh] max-h-[30vh] ${scrollable ? "overflow-y-auto" : ""}`}>
			<div className="flex justify-between items-center mb-4 font-inter">
				<h2 className="text-medium font-semibold text-heading">{title}</h2>

				<button
					onClick={onClearAll}
					className="text-sm text-danger hover:text-danger-hover transition-colors"
				>
					Clear All
				</button>
			</div>

			<div>
				{isLoading ? (
					<div className="flex justify-center items-center min-h-[20vh] text-medium font-semibold text-heading">Loading...</div>
				) : (
					displayItems.map((item, index) => (
						<ListItem
							key={item.id || `empty-${index}`}
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							id={item.id}
							value={item.text}
							position={item.position}
							placeholder={itemPlaceholder || "Add new item..."}
							onCreate={onCreate}
							onChange={onChange}
							onDelete={onDelete}
							onFocusNext={() => focusNextItem(index)}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default List;