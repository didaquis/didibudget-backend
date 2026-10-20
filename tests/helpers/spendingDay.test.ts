import { describe, expect, test } from 'vitest';
import { dayRangeToBounds, dayToStoredDate, getMonthlyAverageWindow, isValidDay, isValidMonth } from '#/helpers/spendingDay.js';

describe('spendingDay', () => {
	describe('isValidDay', () => {
		test('Should accept real calendar days', () => {
			expect(isValidDay('2026-03-01')).toBe(true);
			expect(isValidDay('2025-12-31')).toBe(true);
			expect(isValidDay('2028-02-29')).toBe(true);
		});

		test('Should reject days that do not exist, other formats and other types', () => {
			['2026-02-29', '2026-02-30', '2026-04-31', '2026-13-01', '2026-00-10', '2026-03-00', '2026-3-1', '2026-03-01T00:00:00.000Z', ' 2026-03-01', '', null, undefined, 20260301]
				.forEach((value) => expect(isValidDay(value)).toBe(false));
		});
	});

	describe('isValidMonth', () => {
		test('Should accept months', () => {
			expect(isValidMonth('2026-01')).toBe(true);
			expect(isValidMonth('2026-12')).toBe(true);
		});

		test('Should reject months that do not exist, other formats and other types', () => {
			['2026-00', '2026-13', '2026-1', '2026-01-01', '', null, undefined, 202601]
				.forEach((value) => expect(isValidMonth(value)).toBe(false));
		});
	});

	describe('dayToStoredDate', () => {
		test('Should store a day at noon UTC', () => {
			expect(dayToStoredDate('2026-03-01')).toStrictEqual(new Date('2026-03-01T12:00:00.000Z'));
			expect(dayToStoredDate('2025-12-31')).toStrictEqual(new Date('2025-12-31T12:00:00.000Z'));
		});
	});

	describe('dayRangeToBounds', () => {
		test('Should turn an inclusive day range into half-open bounds', () => {
			expect(dayRangeToBounds('2026-03-01', '2026-03-31')).toStrictEqual({
				$gte: new Date('2026-03-01T00:00:00.000Z'),
				$lt: new Date('2026-04-01T00:00:00.000Z')
			});
		});

		test('Should accept a range of a single day', () => {
			expect(dayRangeToBounds('2026-03-15', '2026-03-15')).toStrictEqual({
				$gte: new Date('2026-03-15T00:00:00.000Z'),
				$lt: new Date('2026-03-16T00:00:00.000Z')
			});
		});

		test('Should cross the end of a year', () => {
			expect(dayRangeToBounds(null, '2025-12-31')).toStrictEqual({ $lt: new Date('2026-01-01T00:00:00.000Z') });
		});

		test('Should leave out the end that is not provided', () => {
			expect(dayRangeToBounds('2026-03-01', undefined)).toStrictEqual({ $gte: new Date('2026-03-01T00:00:00.000Z') });
			expect(dayRangeToBounds(null, null)).toStrictEqual({});
		});
	});

	describe('getMonthlyAverageWindow', () => {
		test('Should build the window of the full months before the current month', () => {
			expect(getMonthlyAverageWindow(3, '2026-06')).toStrictEqual({
				startDate: new Date('2026-03-01T00:00:00.000Z'),
				endDate: new Date('2026-06-01T00:00:00.000Z')
			});
		});

		test('Should cross the start of a year', () => {
			expect(getMonthlyAverageWindow(2, '2026-01')).toStrictEqual({
				startDate: new Date('2025-11-01T00:00:00.000Z'),
				endDate: new Date('2026-01-01T00:00:00.000Z')
			});
			expect(getMonthlyAverageWindow(24, '2026-03')).toStrictEqual({
				startDate: new Date('2024-03-01T00:00:00.000Z'),
				endDate: new Date('2026-03-01T00:00:00.000Z')
			});
		});

		test('Should include the 1st of the oldest month and exclude the 1st of the current month', () => {
			const { startDate, endDate } = getMonthlyAverageWindow(1, '2026-04');

			expect(dayToStoredDate('2026-03-01') >= startDate).toBe(true);
			expect(dayToStoredDate('2026-04-01') < endDate).toBe(false);
		});
	});

	test('Should run in a process timezone other than UTC', () => {
		expect(new Date('2026-01-01T00:00:00.000Z').getTimezoneOffset()).toBe(-60);
	});
});
