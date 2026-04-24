import { recurringExpenseSuggestionDTO } from '#/dto/recurringExpenseSuggestionDTO.js';

describe('recurringExpenseSuggestionDTO', () => {
	test('Should map all recurring expense suggestion fields to the DTO', () => {
		const recurringExpenseSuggestion = {
			isActive: true,
			startDay: 1,
			endDay: 31,
			uuid: 'uuid-123',
			suggestedExpense: {
				category: {
					_id: 'cat-1',
					name: 'Food',
					emojis: ['🍔', '🍕']
				},
				subcategory: {
					_id: 'sub-1',
					name: 'Groceries',
					emojis: ['🛒']
				},
				quantity: 42.5
			}
		};

		const result = recurringExpenseSuggestionDTO(recurringExpenseSuggestion);

		expect(result).toStrictEqual({
			isActive: true,
			startDay: 1,
			endDay: 31,
			uuid: 'uuid-123',
			suggestedExpense: {
				category: 'cat-1',
				categoryName: 'Food',
				categoryEmojis: ['🍔', '🍕'],
				subcategory: 'sub-1',
				subcategoryName: 'Groceries',
				subcategoryEmojis: ['🛒'],
				quantity: '42.5'
			}
		});
	});

	test('Should handle null subcategory gracefully', () => {
		const recurringExpenseSuggestion = {
			isActive: false,
			startDay: 15,
			endDay: null,
			uuid: 'uuid-456',
			suggestedExpense: {
				category: {
					_id: 'cat-2',
					name: 'Transport',
					emojis: []
				},
				subcategory: null,
				quantity: 10
			}
		};

		const result = recurringExpenseSuggestionDTO(recurringExpenseSuggestion);

		expect(result).toStrictEqual({
			isActive: false,
			startDay: 15,
			endDay: null,
			uuid: 'uuid-456',
			suggestedExpense: {
				category: 'cat-2',
				categoryName: 'Transport',
				categoryEmojis: [],
				subcategory: null,
				subcategoryName: null,
				subcategoryEmojis: [],
				quantity: '10'
			}
		});
	});

	test('Should handle missing category name gracefully', () => {
		const recurringExpenseSuggestion = {
			isActive: true,
			startDay: 1,
			endDay: 15,
			uuid: 'uuid-789',
			suggestedExpense: {
				category: {
					_id: 'cat-3'
				},
				subcategory: {
					_id: 'sub-3'
				},
				quantity: 99.99
			}
		};

		const result = recurringExpenseSuggestionDTO(recurringExpenseSuggestion);

		expect(result.suggestedExpense.categoryName).toBeNull();
		expect(result.suggestedExpense.categoryEmojis).toStrictEqual([]);
		expect(result.suggestedExpense.subcategoryName).toBeNull();
		expect(result.suggestedExpense.subcategoryEmojis).toStrictEqual([]);
	});
});
