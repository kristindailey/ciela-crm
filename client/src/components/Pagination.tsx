interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps)=> {
	if (totalPages <= 1) return null;

	return (
		<div className="flex justify-center items-center gap-2 mt-6">
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`px-4 py-2 rounded-lg font-medium transition-all ${
						currentPage === page
							? "bg-[var(--royal-blue)] text-white"
							: "bg-white text-gray-700 border hover:bg-gray-50"
					}`}
				>
					{page}
				</button>
			))}
		</div>
	);
}

export default Pagination;