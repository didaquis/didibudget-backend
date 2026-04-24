/**
 * Available category types
 */
export const CategoryType = Object.freeze({
	EXPENSE: 'expense',
	INVESTMENT: 'investment',
	PENSION_PLAN: 'pension_plan'
} as const);

export type CategoryTypeValue = typeof CategoryType[keyof typeof CategoryType];
