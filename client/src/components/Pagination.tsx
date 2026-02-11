interface PaginationProps {
	currentPage: number;
	windowStart: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, windowStart, totalPages, onPageChange }: PaginationProps) => {
	if (totalPages <= 1) return null;

	const getVisiblePages = () => {
		if (totalPages <= 4) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		let start = windowStart;
		let end = start + 3;

		if (end > totalPages) {
			end = totalPages;
			start = end - 3;
		}

		return Array.from({ length: end - start + 1}, (_, i) => start + i);
	};

	const visiblePages = getVisiblePages();

	return (
		<nav 
			className="flex justify-center items-center gap-1 sm:gap-2 mt-6"
			aria-label="Pagination"
		>
			<button
				aria-label="Previous page"
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				className={`px-3 py-2 rounded-lg font-semibold font-inter min-w-[44px] transition-all focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)] focus-visible:ring-offset-2 focus-visible:outline-none ${
					currentPage === 1
						? "bg-white text-[var(--royal-blue)]/30 border border-[var(--royal-blue)]/10 cursor-not-allowed"
						: "bg-white text-[var(--royal-blue)] shadow-sm cursor-pointer border border-[var(--royal-blue)]/20 hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30"
				}`}
			>
				←
			</button>


			{visiblePages.map((page) => (
				<button
					key={page}
					aria-label={`${currentPage === page ? "Page:" : ""} ${page}`}
					aria-current={currentPage === page ? "page" : undefined}
					disabled={currentPage === page}
					onClick={() => onPageChange(page)}
					className={`px-4 py-2 rounded-lg font-semibold font-inter min-w-[44px] transition-none focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)] focus-visible:ring-offset-2 focus-visible:outline-none ${
						currentPage === page
							? "bg-[var(--royal-blue)] text-[var(--soft-lavender)] shadow-sm border border-[var(--royal-blue)]"
							: "bg-white text-[var(--royal-blue)] shadow-sm cursor-pointer border border-[var(--royal-blue)]/20 hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30"
					}`}
				>
					{page}
				</button>
			))}

			<button
				aria-label="Next page"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
				className={`px-3 py-2 rounded-lg font-semibold font-inter min-w-[44px] transition-all focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)] focus-visible:ring-offset-2 focus-visible:outline-none ${
					currentPage === totalPages
						? "bg-white text-[var(--royal-blue)]/30 border border-[var(--royal-blue)]/10 cursor-not-allowed"
						: "bg-white text-[var(--royal-blue)] shadow-sm cursor-pointer border border-[var(--royal-blue)]/20 hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30"
				}`}
			>
				→
			</button>
		</nav>
	);
}

export default Pagination;