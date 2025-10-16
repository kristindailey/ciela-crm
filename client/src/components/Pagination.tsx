interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
	if (totalPages <= 1) return null;

	return (
		<nav 
			className="flex justify-center items-center gap-1 sm:gap-2 mt-6"
			aria-label="Pagination"
		>
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					aria-label={`${currentPage === page ? "Page:": ""} ${page}`}
					aria-current={currentPage === page ? "page" : undefined}
					disabled={currentPage === page}
					onClick={() => onPageChange(page)}
					className={`px-4 py-2 rounded-lg font-semibold font-inter min-w-[44px] transition-all focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)] focus-visible:ring-offset-2 focus-visible:outline-none ${
						currentPage === page
							? "bg-[var(--royal-blue)] text-[var(--soft-lavender)] shadow-sm border border-[var(--royal-blue)]"
							: "bg-white text-[var(--royal-blue)] shadow-sm cursor-pointer border border-[var(--royal-blue)]/20 hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30"
					}`}
				>
					{page}
				</button>
			))}
		</nav>
	);
}

export default Pagination;