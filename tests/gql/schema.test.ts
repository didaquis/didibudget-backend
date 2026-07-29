import { describe, expect, test } from 'vitest';
import { buildASTSchema, validateSchema, type GraphQLObjectType } from 'graphql';
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

	test('Should expose getMostUsedExpenseCategories returning a non nullable list', () => {
		const field = schema.getQueryType()?.getFields().getMostUsedExpenseCategories;

		expect(field).toBeDefined();
		expect(String(field?.type)).toBe('[MostUsedExpenseCategory]!');
	});

	test('Should default the arguments of getMostUsedExpenseCategories', () => {
		const field = schema.getQueryType()?.getFields().getMostUsedExpenseCategories;
		const args = Object.fromEntries((field?.args ?? []).map((arg) => [arg.name, arg.defaultValue]));

		expect(args.days).toBe(90);
		expect(args.limit).toBe(6);
	});

	test('Should declare every field of MostUsedExpenseCategory with its type', () => {
		const type = schema.getType('MostUsedExpenseCategory');
		const fields = Object.fromEntries(Object.entries((type as GraphQLObjectType).getFields()).map(([name, field]) => [name, String(field.type)]));

		expect(fields).toStrictEqual({
			category: 'ID!',
			categoryName: 'String!',
			categoryEmojis: '[String]!',
			subcategory: 'ID',
			subcategoryName: 'String',
			subcategoryEmojis: '[String]!',
			total: 'Int!'
		});
	});
});
