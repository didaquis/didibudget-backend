import { expenseCategories } from '../src/config/defaultData.js';
import { generateInmutableKey } from '../src/helpers/inmutableKey.js';

/**
 * Print a new `inmutableKey` that no default category or subcategory uses yet.
 * Usage: `npm run generate-key`
 */
const usedKeys = new Set(expenseCategories.flatMap((category) => [
	category.inmutableKey,
	...category.subcategories.map((subcategory) => subcategory.inmutableKey),
]));

process.stdout.write(`${generateInmutableKey(usedKeys)}\n`);
