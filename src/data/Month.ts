/**
 * Months of the year, in calendar order
 */
export const Month = Object.freeze({
	JANUARY: 'JANUARY',
	FEBRUARY: 'FEBRUARY',
	MARCH: 'MARCH',
	APRIL: 'APRIL',
	MAY: 'MAY',
	JUNE: 'JUNE',
	JULY: 'JULY',
	AUGUST: 'AUGUST',
	SEPTEMBER: 'SEPTEMBER',
	OCTOBER: 'OCTOBER',
	NOVEMBER: 'NOVEMBER',
	DECEMBER: 'DECEMBER'
} as const);

export type MonthValue = typeof Month[keyof typeof Month];
