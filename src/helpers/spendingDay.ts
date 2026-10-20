/**
 * Day maths for spendings. A spending belongs to a calendar day, stored at 12:00 UTC of that day.
 * Every value here is built with `Date.UTC`, never with the process timezone.
 */

import { isProvided } from '#/helpers/isProvided.js';

const DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

/**
 * Month numbers go from 1 to 12; `Date.UTC()` months go from 0 to 11
 */
const MONTH_INDEX_OFFSET = 1;
const FIRST_DAY_OF_MONTH = 1;
const STORED_HOUR = 12;
const NEXT_DAY_OFFSET = 1;

interface DayParts {
	year: number;
	month: number;
	day: number;
}

const parseDay = (value: unknown): DayParts | null => {
	if (typeof value !== 'string') {
		return null;
	}

	const match = DAY_PATTERN.exec(value);
	if (!match) {
		return null;
	}

	const [, year, month, day] = match.map(Number);
	const date = new Date(Date.UTC(year, month - MONTH_INDEX_OFFSET, day));
	const isRealDay = date.getUTCFullYear() === year && date.getUTCMonth() === month - MONTH_INDEX_OFFSET && date.getUTCDate() === day;

	return isRealDay ? { year, month, day } : null;
};

const toDayParts = (day: string): DayParts => {
	const parts = parseDay(day);
	if (!parts) {
		throw new Error(`Not a valid day: ${day}`);
	}
	return parts;
};

/**
 * Check if a value is a real calendar day as `YYYY-MM-DD`, e.g. `2026-03-01`
 */
export const isValidDay = (value: unknown): value is string => {
	return parseDay(value) !== null;
};

/**
 * Check if a value is a month as `YYYY-MM`, e.g. `2026-03`
 */
export const isValidMonth = (value: unknown): value is string => {
	return typeof value === 'string' && MONTH_PATTERN.test(value);
};

/**
 * Get the value stored for a day: 12:00 UTC of that day
 */
export const dayToStoredDate = (day: string): Date => {
	const { year, month, day: dayOfMonth } = toDayParts(day);
	return new Date(Date.UTC(year, month - MONTH_INDEX_OFFSET, dayOfMonth, STORED_HOUR));
};

/**
 * Turn a range of days, both inclusive, into Mongo bounds: `[startDay 00:00Z, endDay + 1 day 00:00Z)`.
 * An end that is not provided is left out.
 */
export const dayRangeToBounds = (startDay?: string | null, endDay?: string | null): { $gte?: Date; $lt?: Date } => {
	const bounds: { $gte?: Date; $lt?: Date } = {};

	if (isProvided(startDay)) {
		const { year, month, day } = toDayParts(startDay);
		bounds.$gte = new Date(Date.UTC(year, month - MONTH_INDEX_OFFSET, day));
	}
	if (isProvided(endDay)) {
		const { year, month, day } = toDayParts(endDay);
		bounds.$lt = new Date(Date.UTC(year, month - MONTH_INDEX_OFFSET, day + NEXT_DAY_OFFSET));
	}

	return bounds;
};

/**
 * Get the range of the last N full months before `currentMonth` (`YYYY-MM`): `[startDate, endDate)`
 */
export const getMonthlyAverageWindow = (lastNMonths: number, currentMonth: string): { startDate: Date; endDate: Date } => {
	const [year, month] = currentMonth.split('-').map(Number);
	const currentMonthIndex = month - MONTH_INDEX_OFFSET;

	return {
		startDate: new Date(Date.UTC(year, currentMonthIndex - lastNMonths, FIRST_DAY_OF_MONTH)),
		endDate: new Date(Date.UTC(year, currentMonthIndex, FIRST_DAY_OF_MONTH))
	};
};
