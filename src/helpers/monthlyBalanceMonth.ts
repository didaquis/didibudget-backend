import { Month, MonthValue } from '#/data/Month.js';

/**
 * Sanity bounds for the year of a monthly balance
 */
export const MIN_YEAR = 1970;
export const MAX_YEAR = 2100;

/**
 * Month numbers go from 1 to 12; array indexes and `Date.UTC()` months go from 0 to 11
 */
const MONTH_INDEX_OFFSET = 1;
const FIRST_DAY_OF_MONTH = 1;
const NOON_UTC = 12;

const MONTHS: readonly MonthValue[] = Object.values(Month);

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/**
 * Get the number of a month, e.g. `JANUARY` → `1`
 */
export const getMonthNumber = (month: MonthValue): number => {
	return MONTHS.indexOf(month) + MONTH_INDEX_OFFSET;
};

/**
 * Get the name of a month number, e.g. `1` → `JANUARY`
 */
export const getMonthName = (monthNumber: number): MonthValue => {
	return MONTHS[monthNumber - MONTH_INDEX_OFFSET];
};

/**
 * Format a month for people, e.g. `(2026, 1)` → `January 2026`
 */
export const formatMonth = (year: number, monthNumber: number): string => {
	return monthFormatter.format(Date.UTC(year, monthNumber - MONTH_INDEX_OFFSET, FIRST_DAY_OF_MONTH));
};

/**
 * Value for the deprecated `date` field, kept only so older versions can be restored.
 * Noon UTC falls on day 1 in every time zone from UTC−11 to UTC+11. Remove it together with `date`.
 */
export const getTransitionalDate = (year: number, monthNumber: number): Date => {
	return new Date(Date.UTC(year, monthNumber - MONTH_INDEX_OFFSET, FIRST_DAY_OF_MONTH, NOON_UTC));
};
