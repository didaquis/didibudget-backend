import { Types } from 'mongoose';

/**
 * Minimal shape a category or subcategory needs to feed this DTO
 */
export interface CategoryLike {
	_id: Types.ObjectId;
	name: string;
	emojis?: string[];
}

export interface MostUsedExpenseCategoryInput {
	category: CategoryLike;
	subcategory: CategoryLike | null;
	total: number;
}

export interface MostUsedExpenseCategoryDTO {
	category: Types.ObjectId;
	categoryName: string;
	categoryEmojis: string[];
	subcategory: Types.ObjectId | null;
	subcategoryName: string | null;
	subcategoryEmojis: string[];
	total: number;
}

/**
 * Builds a DTO of a most used expense category
 */
export const mostUsedExpenseCategoryDTO = ({ category, subcategory, total }: MostUsedExpenseCategoryInput): MostUsedExpenseCategoryDTO => {
	return {
		category: category._id,
		categoryName: category.name,
		categoryEmojis: category.emojis ?? [],
		subcategory: subcategory?._id ?? null,
		subcategoryName: subcategory?.name ?? null,
		subcategoryEmojis: subcategory?.emojis ?? [],
		total: total
	};
};
