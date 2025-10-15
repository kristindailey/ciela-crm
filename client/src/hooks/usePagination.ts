import { useState } from "react";

interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage: number;
}

export const usePagination = <T,>({ items, itemsPerPage }: UsePaginationProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(items.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return {
		currentPage, 
		setCurrentPage,
		totalPages,
		paginatedItems,
		handlePageChange,
	};
};