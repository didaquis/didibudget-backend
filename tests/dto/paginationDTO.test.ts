import { describe, expect, test } from 'vitest';
import { paginationDTO } from '#/dto/paginationDTO.js';

describe('paginationDTO', () => {
	test('Should map all pagination fields to the DTO', () => {
		const result = paginationDTO(2, 10, 95);

		expect(result).toStrictEqual({
			currentPage: 2,
			totalPages: 10,
			totalCount: 95
		});
	});

	test('Should map page parameter to currentPage field', () => {
		const result = paginationDTO(5, 20, 200);

		expect(result.currentPage).toBe(5);
	});

	test('Should map first page correctly', () => {
		const result = paginationDTO(1, 1, 3);

		expect(result).toStrictEqual({
			currentPage: 1,
			totalPages: 1,
			totalCount: 3
		});
	});
});
