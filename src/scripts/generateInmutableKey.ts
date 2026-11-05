import { expenseCategories } from '#/config/defaultData.js';
import { generateInmutableKey } from '#/helpers/inmutableKey.js';

/**
 * Print a new `inmutableKey` that no default category or subcategory uses yet.
 * Usage: `npm run generate-key`
 */
const usedKeys = new Set(expenseCategories.flatMap((category) => [
	category.inmutableKey,
	...category.subcategories.map((subcategory) => subcategory.inmutableKey),
]));

process.stdout.write(`${generateInmutableKey(usedKeys)}\n`);
