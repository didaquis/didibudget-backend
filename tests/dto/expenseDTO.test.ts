import { describe, expect, test } from 'vitest';
import { expenseDTO } from '#/dto/expenseDTO.js';

describe('expenseDTO', () => {
	test('Should map all expense fields to the DTO', () => {
		const expense = {
			category: 'Food',
			subcategory: 'Groceries',
			quantity: 42.5,
			date: '2023-10-01',
			currencyISO: 'EUR',
			uuid: 'abc-123'
		};

		const result = expenseDTO(expense);

		expect(result).toStrictEqual({
			category: 'Food',
			subcategory: 'Groceries',
			quantity: '42.5',
			date: '2023-10-01',
			currencyISO: 'EUR',
			uuid: 'abc-123'
		});
	});

	test('Should convert quantity to string', () => {
		const expense = {
			category: 'Transport',
			subcategory: 'Bus',
			quantity: 100,
			date: '2023-01-15',
			currencyISO: 'USD',
			uuid: 'def-456'
		};

		const result = expenseDTO(expense);

		expect(typeof result.quantity).toBe('string');
		expect(result.quantity).toBe('100');
	});
});
