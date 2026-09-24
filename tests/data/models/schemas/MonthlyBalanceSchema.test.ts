import { describe, expect, test } from 'vitest';
import MonthlyBalanceSchema from '#/data/models/schemas/MonthlyBalanceSchema.js';

describe('MonthlyBalanceSchema', () => {
	// The resolver relies on this index alone to reject repeated months
	test('Should declare a unique index on user, year and month, in that order', () => {
		const index = MonthlyBalanceSchema.indexes().find(([fields]) => 'year' in fields);

		expect(Object.keys(index?.[0] ?? {})).toEqual(['user_id', 'year', 'month']);
		expect(index?.[1]).toMatchObject({ unique: true });
	});

	test('Should not store nor index a date', () => {
		expect(MonthlyBalanceSchema.path('date')).toBeUndefined();
		expect(MonthlyBalanceSchema.indexes().some(([fields]) => 'date' in fields)).toBe(false);
	});
});
