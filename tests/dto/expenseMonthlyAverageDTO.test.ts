import { expenseMonthlyAverageDTO } from '#/dto/expenseMonthlyAverageDTO.js';

describe('expenseMonthlyAverageDTO', () => {
	test('Should return rounded average and currencyISO', () => {
		const result = expenseMonthlyAverageDTO(123.456, 'EUR');

		expect(result).toStrictEqual({
			average: 123.46,
			currencyISO: 'EUR'
		});
	});

	test('Should round average down when third decimal is less than 5', () => {
		const result = expenseMonthlyAverageDTO(99.994, 'USD');

		expect(result).toStrictEqual({
			average: 99.99,
			currencyISO: 'USD'
		});
	});

	test('Should handle zero average', () => {
		const result = expenseMonthlyAverageDTO(0, 'GBP');

		expect(result).toStrictEqual({
			average: 0,
			currencyISO: 'GBP'
		});
	});
});
