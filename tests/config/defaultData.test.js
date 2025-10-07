const { expenseCategories } = require('../../src/config/defaultData');
const { CategoryType } = require('../../src/data/CategoryType');

describe('defaultData', () => {
	it('should be an array with expense categories and subcategories', () => {
		expect(Array.isArray(expenseCategories)).toBe(true);

		expect(expenseCategories.length).toBeGreaterThan(0);

		expenseCategories.forEach(category => {
			expect(category).toHaveProperty('name');
			expect(category).toHaveProperty('inmutableKey');
			expect(category).toHaveProperty('subcategories');
			expect(category).toHaveProperty('emojis');
			expect(category).toHaveProperty('categoryType');

			expect(typeof category.name).toBe('string');
			expect(typeof category.inmutableKey).toBe('string');
			expect(Array.isArray(category.subcategories)).toBe(true);
			expect(Array.isArray(category.emojis)).toBe(true);
			expect(typeof category.categoryType).toBe('string');
			expect(Object.values(CategoryType)).toContain(category.categoryType);

			category.subcategories.forEach(subcategory => {
				expect(subcategory).toHaveProperty('name');
				expect(subcategory).toHaveProperty('inmutableKey');
				expect(subcategory).toHaveProperty('emojis');
				expect(subcategory).toHaveProperty('categoryType');

				expect(typeof subcategory.name).toBe('string');
				expect(typeof subcategory.inmutableKey).toBe('string');
				expect(Array.isArray(subcategory.emojis)).toBe(true);
				expect(typeof subcategory.categoryType).toBe('string');
				expect(Object.values(CategoryType)).toContain(subcategory.categoryType);

				subcategory.emojis.forEach(emoji => {
					expect(typeof emoji).toBe('string');
				});
			});

			category.emojis.forEach(emoji => {
				expect(typeof emoji).toBe('string');
			});
		});
	});

	it('should have a valid value in the property name of the expense categories and subcategories', () => {
		const minLength = 4;
		expenseCategories.forEach(category => {
			expect(category.name.length).toBeGreaterThanOrEqual(minLength);

			category.subcategories.forEach(subcategory => {
				expect(subcategory.name.length).toBeGreaterThanOrEqual(minLength);
			});
		});
	});

	it('should have a valid value in the property inmutableKey of the expense categories and subcategories', () => {
		const validPattern = new RegExp(/^[a-f0-9]{20}$/i);
		expenseCategories.forEach(category => {
			expect(category.inmutableKey).toMatch(validPattern);

			category.subcategories.forEach(subcategory => {
				expect(subcategory.inmutableKey).toMatch(validPattern);
			});
		});
	});

	it('should have an unique value in the property inmutableKey of the expense categories and subcategories', () => {
		const inmutableKeyList = [];

		expenseCategories.forEach(category => {
			expect(inmutableKeyList).not.toContain(category.inmutableKey);
			inmutableKeyList.push(category.inmutableKey);

			category.subcategories.forEach(subcategory => {
				expect(inmutableKeyList).not.toContain(subcategory.inmutableKey);
				inmutableKeyList.push(subcategory.inmutableKey);
			});
		});
	});
});