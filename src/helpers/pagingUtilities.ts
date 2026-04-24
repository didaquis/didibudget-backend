/**
 * Calc the offset value from the pagination parameters
 */
export const getOffset = (page: number, pageSize: number): number => {
	const offsetAdjustement = 1;
	return (page - offsetAdjustement) * pageSize;
};

/**
 * Calc the number of pages from the total count and page size
 */
export const getTotalPagesNumber = (totalCount: number, pageSize: number): number => {
	return Math.ceil(totalCount / pageSize);
};
