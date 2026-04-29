import { describe, expect, test } from 'vitest';
import { Types } from 'mongoose';
import { monthlyBalanceDTO } from '#/dto/monthlyBalanceDTO.js';

describe('monthlyBalanceDTO', () => {
	test('Should map all monthlyBalance fields to the DTO', () => {
		const monthlyBalance = {
			balance: Types.Decimal128.fromString('1234.56'),
			date: '2023-10-01',
			currencyISO: 'EUR',
			uuid: 'uuid-001'
		};

		const result = monthlyBalanceDTO(monthlyBalance);

		expect(result).toStrictEqual({
			balance: '1234.56',
			date: '2023-10-01',
			currencyISO: 'EUR',
			uuid: 'uuid-001'
		});
	});

	test('Should convert balance to string', () => {
		const monthlyBalance = {
			balance: Types.Decimal128.fromString('-500'),
			date: '2023-01-15',
			currencyISO: 'USD',
			uuid: 'uuid-002'
		};

		const result = monthlyBalanceDTO(monthlyBalance);

		expect(typeof result.balance).toBe('string');
		expect(result.balance).toBe('-500');
	});
});
