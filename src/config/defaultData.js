'use strict';

/* Home doc */
/**
 * @file Contains all the default data to insert on database on first start of application
 * @see module:defaultData
 */

/* Module doc */
/**
 * Contains all the default data to insert on database on first start of application
 * @module defaultData
 */


/**
 * Default categories and subcategories for expenses
 * @typedef {Object[]}
 */
const expenseCategories = [
	{
		name: 'Computers, smartphones and electronic devices',
		subcategories: [],
	},
	{
		name: 'Mobile phone cost (calls and internet cost, not devices)',
		subcategories: [],
	},
	{
		name: 'Applications, software and subscriptions to online services',
		subcategories: [],
	},
	{
		name: 'Presents, gifts',
		subcategories: [],
	},
	{
		name: 'Medicines and health care services',
		subcategories: [],
	},
	{
		name: 'Clothes and shoes',
		subcategories: [],
	},
	{
		name: 'Public transport',
		subcategories: [],
	},
	{
		name: 'Private vehicles',
		subcategories: [
			{
				name: 'Vehicle taxes, technical inspection',
			},
			{
				name: 'Vehicle insurance',
			},
			{
				name: 'Spare parts and maintenance',
			},
			{
				name: 'Garage',
			},
			{
				name: 'Vehicle cost (renting, leasing, vehicle itself)',
			},
			{
				name: 'Fuel',
			},
			{
				name: 'Tolls, parkings and tunnels',
			}
		],
	},
	{
		name: 'Travels & holidays & weekend breaks',
		subcategories: [],
	},
	{
		name: 'Home',
		subcategories: [
			{
				name: 'Groceries, cleaning products, personal care products, objects, tools and cookware',
			},
			{
				name: 'Appliances and furniture',
			},
			{
				name: 'Electricity bill',
			},
			{
				name: 'Water bill',
			},
			{
				name: 'Gas bill',
			},
			{
				name: 'ISP provider bill',
			},
			{
				name: 'Home taxes',
			},
			{
				name: 'Home insurance',
			},
			{
				name: 'Taxes of the community of neighbors',
			},
			{
				name: 'Repairs and home works',
			},
			{
				name: 'Mortgage',
			},
			{
				name: 'Rent',
			}
		],
	},
	{
		name: 'Professional career',
		subcategories: [
			{
				name: 'English classes',
			},
			{
				name: 'Books, events, conferences, formative courses, certifications',
			}
		],
	},
	{
		name: 'Recreational activities',
		subcategories: [
			{
				name: 'Bar, restaurants and pubs',
			},
			{
				name: 'Gym and climbing wall',
			},
			{
				name: 'Books, events, cinema, music, concerts, museums, and other cultural activities',
			},
			{
				name: 'Camping, shelter',
			},
			{
				name: 'Recreational courses and formative sessions (cooking, alpinism...)',
			}
		],
	},
	{
		name: 'Sports equipment (including boots and jackets)',
		subcategories: [],
	},
	{
		name: 'Other expenses',
		subcategories: [],
	},
	{
		name: 'Bank charges (commissions)',
		subcategories: [],
	},
	{
		name: 'Government taxes',
		subcategories: [],
	},
	{
		name: 'Personal insurance (sport, life...)',
		subcategories: [],
	},
	{
		name: 'Retirement plan and savings plan',
		subcategories: [],
	},
];

/** Default data for database */
module.exports = { expenseCategories };
