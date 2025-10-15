interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
	if (totalPages <= 1) return null;

	return (
		<nav 
			className="flex justify-center items-center gap-2 mt-6"
			aria-label="Pagination"
		>
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`px-4 py-2 rounded-lg font-semibold font-inter transition-all ${
						currentPage === page
							? "bg-[var(--royal-blue)] text-[var(--soft-lavender)] shadow-sm border border-[var(--royal-blue)]"
							: "bg-white text-[var(--royal-blue)] shadow-sm cursor-pointer border border-[var(--royal-blue)] hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30"
					}`}
				>
					{page}
				</button>
			))}
		</nav>
	);
}

export default Pagination;