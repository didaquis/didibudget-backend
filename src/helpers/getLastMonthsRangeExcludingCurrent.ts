/**
 * Calculates the date range of the last N full months excluding the current month.
 */
export const getLastMonthsRangeExcludingCurrent = (lastNMonths: number): { startDate: Date; endDate: Date } => {
	const today = new Date();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();

	const startMonth = currentMonth - lastNMonths;
	const numberOfMonthsInYear = 12;
	const startYear = currentYear + Math.floor(startMonth / numberOfMonthsInYear);
	const normalizedStartMonth = ((startMonth % numberOfMonthsInYear) + numberOfMonthsInYear) % numberOfMonthsInYear;

	const firstDayOfMonth = 1;
	const startDate = new Date(startYear, normalizedStartMonth, firstDayOfMonth);
	const endDate = new Date(currentYear, currentMonth, firstDayOfMonth);

	return { startDate, endDate };
};
