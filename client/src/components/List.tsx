interface ListProps {
	title: string;
}

const List = ({ title }: ListProps) => {
	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center mb-4 font-inter">
				<h2 className="text-xl font-semibold">{title}</h2>
				<button
					onClick={() => {}}
					className="text-sm text-red-600 hover:text-red-700"
				>
					Clear All
				</button>
			</div>
		</div>
	);
};

export default List;