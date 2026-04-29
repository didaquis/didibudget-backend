import { describe, expect, test } from 'vitest';
import { Types } from 'mongoose';
import { RecurringExpenseSuggestionDTO, recurringExpenseSuggestionDTO } from '#/dto/recurringExpenseSuggestionDTO.js';

describe('recurringExpenseSuggestionDTO', () => {
	test('Should map all recurring expense suggestion fields to the DTO', () => {
		const recurringExpenseSuggestion = {
			_id: new Types.ObjectId('507f1f77bcf86cd799439010'),
			user_id: new Types.ObjectId('507f1f77bcf86cd799439001'),
			isActive: true,
			startDay: 1,
			endDay: 31,
			uuid: 'uuid-123',
			suggestedExpense: {
				_id: new Types.ObjectId('507f1f77bcf86cd799439099'),
				category: new Types.ObjectId('507f1f77bcf86cd799439011'),
				subcategory: new Types.ObjectId('507f1f77bcf86cd799439012'),
				quantity: Types.Decimal128.fromString('42.5')
			}
		};

		const result = recurringExpenseSuggestionDTO(recurringExpenseSuggestion);

		const expectedResult: RecurringExpenseSuggestionDTO = {
			isActive: true,
			startDay: 1,
			endDay: 31,
			uuid: 'uuid-123',
			suggestedExpense: {
				category: new Types.ObjectId('507f1f77bcf86cd799439011'),
				categoryName: 'Foo',
				categoryEmojis: [
					'🏠'
				],
				subcategory: new Types.ObjectId('507f1f77bcf86cd799439012'),
				subcategoryName: 'Bar',
				subcategoryEmojis: [
					'💡'
				],
				quantity: '42.5'
			}
		};

		expect(result).toStrictEqual(expectedResult);
	});

	test('Should handle null subcategory gracefully', () => {
		const recurringExpenseSuggestion = {
			_id: new Types.ObjectId('507f1f77bcf86cd799439020'),
			user_id: new Types.ObjectId('507f1f77bcf86cd799439002'),
			isActive: false,
			startDay: 15,
			endDay: 23,
			uuid: 'uuid-456',
			suggestedExpense: {
				_id: new Types.ObjectId('507f1f77bcf86cd799439098'),
				category: new Types.ObjectId('507f1f77bcf86cd799439013'),
				quantity: Types.Decimal128.fromString('10')
			}
		};

		const result = recurringExpenseSuggestionDTO(recurringExpenseSuggestion);

		expect(result).toStrictEqual({
			isActive: false,
			startDay: 15,
			endDay: 23,
			uuid: 'uuid-456',
			suggestedExpense: {
				category: '507f1f77bcf86cd799439013',
				subcategory: null,
				quantity: '10'
			}
		});
	});

});

