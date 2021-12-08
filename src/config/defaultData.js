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
			'Vehicle taxes, technical inspection',
			'Vehicle insurance',
			'Spare parts and maintenance',
			'Garage',
			'Vehicle cost (renting, leasing, vehicle itself)',
			'Fuel',
			'Tolls, parkings and tunnels',
		],
	},
	{
		name: 'Travels & holidays & weekend breaks',
		subcategories: [],
	},
	{
		name: 'Home',
		subcategories: [
			'Groceries, cleaning products, personal care products, objects, tools and cookware',
			'Appliances and furniture',
			'Electricity bill',
			'Water bill',
			'Gas bill',
			'ISP provider bill',
			'Home taxes',
			'Home insurance',
			'Taxes of the community of neighbors',
			'Repairs and home works',
			'Mortgage',
			'Rent',
		],
	},
	{
		name: 'Professional career',
		subcategories: [
			'English classes',
			'Books, events, conferences, formative courses, certifications',
		],
	},
	{
		name: 'Recreational activities',
		subcategories: [
			'Bar, restaurants and pubs',
			'Gym and climbing wall',
			'Books, events, cinema, music, concerts, museums, and other cultural activities',
			'Camping, shelter',
			'Recreational courses and formative sessions (cooking, alpinism...)',
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
