import { describe, expect, test } from 'vitest';
import { Types } from 'mongoose';
import { RecurringExpenseSuggestionDTO, RecurringExpenseSuggestionLean, recurringExpenseSuggestionDTO } from '#/dto/recurringExpenseSuggestionDTO.js';
import { CategoryType } from '#/data/CategoryType.js';

describe('recurringExpenseSuggestionDTO', () => {
	test('Should map all recurring expense suggestion fields to the DTO', () => {
		const categoryId = new Types.ObjectId('507f1f77bcf86cd799439011');
		const subcategoryId = new Types.ObjectId('507f1f77bcf86cd799439012');

		const recurringExpenseSuggestion: RecurringExpenseSuggestionLean = {
			_id: new Types.ObjectId('507f1f77bcf86cd799439010'),
			user_id: new Types.ObjectId('507f1f77bcf86cd799439001'),
			isActive: true,
			startDay: 1,
			endDay: 31,
			uuid: 'uuid-123',
			suggestedExpense: {
				_id: new Types.ObjectId('507f1f77bcf86cd799439099'),
				category: {
					_id: categoryId,
					name: 'Foo',
					emojis: ['🏠'],
					subcategories: [],
					inmutableKey: 'foo',
					uuid: 'cat-uuid-1',
					categoryType: CategoryType.EXPENSE,
				},
				subcategory: {
					_id: subcategoryId,
					name: 'Bar',
					emojis: ['💡'],
					inmutableKey: 'bar',
					uuid: 'subcat-uuid-1',
				},
				quantity: Types.Decimal128.fromString('42.5'),
			},
		};

		const result = recurringExpenseSuggestionDTO(recurringExpenseSuggestion);

		const expectedResult: RecurringExpenseSuggestionDTO = {
			isActive: true,
			startDay: 1,
			endDay: 31,
			uuid: 'uuid-123',
			suggestedExpense: {
				category: categoryId,
				categoryName: 'Foo',
				categoryEmojis: ['🏠'],
				subcategory: subcategoryId,
				subcategoryName: 'Bar',
				subcategoryEmojis: ['💡'],
				quantity: '42.5',
			},
		};

		expect(result).toStrictEqual(expectedResult);
	});

	test('Should handle null subcategory gracefully', () => {
		const categoryId = new Types.ObjectId('507f1f77bcf86cd799439013');

		const recurringExpenseSuggestion: RecurringExpenseSuggestionLean = {
			_id: new Types.ObjectId('507f1f77bcf86cd799439020'),
			user_id: new Types.ObjectId('507f1f77bcf86cd799439002'),
			isActive: false,
			startDay: 15,
			endDay: 23,
			uuid: 'uuid-456',
			suggestedExpense: {
				_id: new Types.ObjectId('507f1f77bcf86cd799439098'),
				category: {
					_id: categoryId,
					name: 'Baz',
					emojis: [],
					subcategories: [],
					inmutableKey: 'baz',
					uuid: 'cat-uuid-2',
					categoryType: CategoryType.EXPENSE,
				},
				quantity: Types.Decimal128.fromString('10'),
			},
		};

		const result = recurringExpenseSuggestionDTO(recurringExpenseSuggestion);

		const expectedResult: RecurringExpenseSuggestionDTO = {
			isActive: false,
			startDay: 15,
			endDay: 23,
			uuid: 'uuid-456',
			suggestedExpense: {
				category: categoryId,
				categoryName: 'Baz',
				categoryEmojis: [],
				subcategory: null,
				subcategoryName: null,
				subcategoryEmojis: [],
				quantity: '10',
			},
		};

		expect(result).toStrictEqual(expectedResult);
	});
});

