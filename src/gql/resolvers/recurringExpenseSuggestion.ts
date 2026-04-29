import { recurringExpenseSuggestionDTO, RecurringExpenseSuggestionDTO, type SuggestedExpensePopulated } from '#/dto/recurringExpenseSuggestionDTO.js';
import { Context } from '../auth/setContext.js';
interface GetRecurringExpenseSuggestionsByDayArgs {
	day: number;
}

interface RegisterRecurringExpenseSuggestionArgs {
	isActive: boolean;
	startDay: number;
	endDay: number;
	suggestedExpense: {
		category: string;
		subcategory?: string | null;
		quantity: number;
	};
}

/**
 * All resolvers related to Recurring Expense Suggestion
 */
export const Query = {
	/**
	 * Get all recurring expense suggestions for an user
	 */
	getRecurringExpenseSuggestions: async (_parent: unknown, _args: unknown, context: Context): Promise<RecurringExpenseSuggestionDTO[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		const allSuggestions = await context.di.model.RecurringExpenseSuggestion.find({ user_id: user._id })
			.populate<{ suggestedExpense: SuggestedExpensePopulated }>({ path: 'suggestedExpense.category', select: 'name emojis', model: context.di.model.ExpenseCategory })
			.populate<{ suggestedExpense: SuggestedExpensePopulated }>({ path: 'suggestedExpense.subcategory', select: 'name emojis', model: context.di.model.ExpenseSubcategory })
			.lean();

		return allSuggestions.map((suggestion) => recurringExpenseSuggestionDTO(suggestion));
	},
	/**
	 * Get the active recurring expense suggestions for an user for a specific day of the month
	 */
	getRecurringExpenseSuggestionsByDay: async (_parent: unknown, { day }: GetRecurringExpenseSuggestionsByDayArgs, context: Context): Promise<RecurringExpenseSuggestionDTO[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		const minDay = 1;
		const maxDay = 31;
		context.di.parameterValidations.isIntegerBetween(day, minDay, maxDay);

		const user = await context.di.authValidation.getUser(context);

		const allSuggestions = await context.di.model.RecurringExpenseSuggestion.find({
			user_id: user._id,
			isActive: true,
			$expr: {
				$or: [
					{
						$and: [
							{ $lte: ['$startDay', day] },
							{ $gte: ['$endDay', day] }
						]
					},
					{
						$and: [
							{ $gt: ['$startDay', '$endDay'] },
							{
								$or: [
									{ $gte: [day, '$startDay'] },
									{ $lte: [day, '$endDay'] }
								]
							}
						]
					}
				]
			}
		})
			.populate<{ suggestedExpense: SuggestedExpensePopulated }>({ path: 'suggestedExpense.category', select: 'name emojis', model: context.di.model.ExpenseCategory })
			.populate<{ suggestedExpense: SuggestedExpensePopulated }>({ path: 'suggestedExpense.subcategory', select: 'name emojis', model: context.di.model.ExpenseSubcategory })
			.lean();

		return allSuggestions.map((suggestion) => recurringExpenseSuggestionDTO(suggestion));
	},
};

export const Mutation = {
	/**
	 * Register a recurring expense suggestion
	 */
	registerRecurringExpenseSuggestion: async (_parent: unknown, { isActive, startDay, endDay, suggestedExpense }: RegisterRecurringExpenseSuggestionArgs, context: Context): Promise<RecurringExpenseSuggestionDTO> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		const saved = await context.di.model.RecurringExpenseSuggestion.create({
			user_id: user._id,
			isActive: isActive,
			startDay: startDay,
			endDay: endDay,
			suggestedExpense: {
				category: suggestedExpense.category,
				subcategory: suggestedExpense.subcategory,
				quantity: suggestedExpense.quantity
			}
		});

		const populated = await context.di.model.RecurringExpenseSuggestion.findById(saved._id)
			.populate<{ suggestedExpense: SuggestedExpensePopulated }>({ path: 'suggestedExpense.category', select: 'name emojis', model: context.di.model.ExpenseCategory })
			.populate<{ suggestedExpense: SuggestedExpensePopulated }>({ path: 'suggestedExpense.subcategory', select: 'name emojis', model: context.di.model.ExpenseSubcategory })
			.lean();

		if (!populated) {
			throw new Error('Failed to populate recurring expense suggestion');
		}

		return recurringExpenseSuggestionDTO(populated);
	},
};
