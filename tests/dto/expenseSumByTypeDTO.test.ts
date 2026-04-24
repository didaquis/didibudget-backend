import { expenseSumByTypeDTO } from '#/dto/expenseSumByTypeDTO.js';

describe('expenseSumByTypeDTO', () => {
	test('Should return categoryType, currencyISO and sum', () => {
		const result = expenseSumByTypeDTO('Food', 'EUR', 150.75);

		expect(result).toStrictEqual({
			categoryType: 'Food',
			currencyISO: 'EUR',
			sum: 150.75
		});
	});

	test('Should handle numeric sum values', () => {
		const result = expenseSumByTypeDTO('Transport', 'USD', 0);

		expect(result).toStrictEqual({
			categoryType: 'Transport',
			currencyISO: 'USD',
			sum: 0
		});
	});
});
