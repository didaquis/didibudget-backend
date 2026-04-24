import { vi } from 'vitest';
import { getLastMonthsRangeExcludingCurrent } from '#/helpers/getLastMonthsRangeExcludingCurrent.js';

describe('getLastMonthsRangeExcludingCurrent', () => {
	const mockDate = new Date(2023, 5, 15); // June 15, 2023

	beforeAll(() => {
		vi.useFakeTimers().setSystemTime(mockDate);
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	test('Should return correct range for last 1 month excluding current', () => {
		const result = getLastMonthsRangeExcludingCurrent(1);
		expect(result.startDate).toEqual(new Date(2023, 4, 1)); // May 1, 2023
		expect(result.endDate).toEqual(new Date(2023, 5, 1)); // June 1, 2023
	});

	test('Should return correct range for last 3 months excluding current', () => {
		const result = getLastMonthsRangeExcludingCurrent(3);
		expect(result.startDate).toEqual(new Date(2023, 2, 1)); // March 1, 2023
		expect(result.endDate).toEqual(new Date(2023, 5, 1)); // June 1, 2023
	});

	test('Should return correct range when crossing year boundary', () => {
		const januaryDate = new Date(2023, 0, 15); // January 15, 2023
		vi.setSystemTime(januaryDate);

		const result = getLastMonthsRangeExcludingCurrent(2);
		expect(result.startDate).toEqual(new Date(2022, 10, 1)); // November 1, 2022
		expect(result.endDate).toEqual(new Date(2023, 0, 1)); // January 1, 2023
	});

	test('Should handle 0 months', () => {
		vi.setSystemTime(mockDate);

		const result = getLastMonthsRangeExcludingCurrent(0);
		expect(result.startDate).toEqual(new Date(2023, 5, 1)); // June 1, 2023
		expect(result.endDate).toEqual(new Date(2023, 5, 1)); // June 1, 2023
	});
});
