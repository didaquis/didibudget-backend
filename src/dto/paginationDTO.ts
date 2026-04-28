export interface PaginationDTO {
	currentPage: number;
	totalPages: number;
	totalCount: number;
}

/**
 * Builds a DTO for ExpenseSumByType
 */
export const paginationDTO = (
	page: number,
	totalPages: number,
	totalCount: number
): PaginationDTO => {
	return {
		currentPage: page,
		totalPages,
		totalCount
	};
};
