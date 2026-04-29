/**
 * Available currencies
 */
export const CurrencyISO = Object.freeze({
	EUR: 'EUR'
} as const);

export type CurrencyISOType = typeof CurrencyISO[keyof typeof CurrencyISO];
