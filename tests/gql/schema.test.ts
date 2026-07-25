import { describe, expect, test } from 'vitest';
import { buildASTSchema, validateSchema } from 'graphql';
import typeDefs from '#/gql/types/index.js';

const schema = buildASTSchema(typeDefs);

describe('GraphQL schema', () => {
	test('Should build a valid schema from the merged type definitions', () => {
		expect(validateSchema(schema)).toEqual([]);
	});

	test('Should expose searchExpenses returning a non nullable result', () => {
		const field = schema.getQueryType()?.getFields().searchExpenses;

		expect(field).toBeDefined();
		expect(String(field?.type)).toBe('ExpenseSearchResult!');
	});

	test('Should declare every argument of searchExpenses with its type', () => {
		const field = schema.getQueryType()?.getFields().searchExpenses;
		const args = Object.fromEntries((field?.args ?? []).map((arg) => [arg.name, String(arg.type)]));

		expect(args).toStrictEqual({
			category: 'ID',
			subcategory: 'ID',
			startDate: 'String',
			endDate: 'String',
			minQuantity: 'Float',
			maxQuantity: 'Float',
			sortBy: 'ExpenseSortField',
			sortDirection: 'SortDirection',
			page: 'Int!',
			pageSize: 'Int!'
		});
	});

	test('Should default the sorting arguments', () => {
		const field = schema.getQueryType()?.getFields().searchExpenses;
		const args = Object.fromEntries((field?.args ?? []).map((arg) => [arg.name, arg.defaultValue]));

		expect(args.sortBy).toBe('date');
		expect(args.sortDirection).toBe('desc');
	});

	test('Should declare the values of the sorting enums', () => {
		const sortField = schema.getType('ExpenseSortField');
		const sortDirection = schema.getType('SortDirection');

		expect(sortField).toBeDefined();
		expect(sortDirection).toBeDefined();
	});
});
