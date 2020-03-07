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
 * @type {Array<Object>}
 */
const expenseCategories = [
	{
		name: 'Computers, Smartphones and electronic devices',
		subcategories: null,
	},
	{
		name: 'Mobile phone cost (calls and internet cost)',
		subcategories: null,
	},
	{
		name: 'Applications, software and subscriptions for online services',
		subcategories: null,
	},
	{
		name: 'Presents',
		subcategories: null,
	},
	{
		name: 'Medicines, personal hygiene and health care',
		subcategories: null,
	},
	{
		name: 'Clothes and shoes',
		subcategories: null,
	},
	{
		name: 'Public transport',
		subcategories: null,
	},
	{
		name: 'Private vehicles',
		subcategories: [
			'Vehicle taxes, technical inspection',
			'Vehicle Insurance',
			'Spare parts and maintenance',
			'Garage',
			'Vehicle cost (renting, leasing, vehicle itself)',
			'Fuel',
			'Tolls, parkings and tunnels',
		],
	},
	{
		name: 'Travels & holidays & weekend breaks',
		subcategories: null,
	},
	{
		name: 'Home',
		subcategories: [
			'Food',
			'Household cleaning products',
			'Objects, tools, cookware',
			'Appliances and furniture',
			'Electricity bill',
			'Water bill',
			'Gas bill',
			'ISP provider bill',
			'Home taxes',
			'Home Insurance',
			'Taxes of the community of neighbors',
			'Repairs and home works',
			'Mortgage fee',
			'Rent fee',
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
			'Bar, Restaurants and pubs',
			'Gym and climbing wall',
			'Books, events, cinema, music, concerts, museums, and other cultural activities',
			'Camping, refugees',
			'Recreational courses and formative sessions (cooking, alpinism...)',
		],
	},
	{
		name: 'Sports equipment (including boots and jackets)',
		subcategories: null,
	},
	{
		name: 'Other expenses',
		subcategories: null,
	},
	{
		name: 'Bank charges (commissions)',
		subcategories: null,
	},
	{
		name: 'Government taxes',
		subcategories: null,
	},
	{
		name: 'Personal insurance (sport, life...)',
		subcategories: null,
	},
	{
		name: 'Retirement plan and savings plan',
		subcategories: null,
	},
];

/** Default data for database */
module.exports = { expenseCategories };
