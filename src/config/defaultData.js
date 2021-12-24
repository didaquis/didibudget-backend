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
				inmutableKey: '2c0f7ea86b62582c2308'
			},
			{
				name: 'Vehicle insurance',
				inmutableKey: '55ba8bddc746c078ebc6'
			},
			{
				name: 'Spare parts and maintenance',
				inmutableKey: '0176bf56861cfc5ef72d'
			},
			{
				name: 'Garage',
				inmutableKey: '2bcd348acfe1bf3e7aec'
			},
			{
				name: 'Vehicle cost (renting, leasing, vehicle itself)',
				inmutableKey: '3fd1f7e8e2f828cbe212'
			},
			{
				name: 'Fuel',
				inmutableKey: '6f4ab3b2b1b3268d9138'
			},
			{
				name: 'Tolls, parkings and tunnels',
				inmutableKey: 'a54b87aab3bf45fa393b'
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
				inmutableKey: '3e8e136c59a6d961c0cd'
			},
			{
				name: 'Appliances and furniture',
				inmutableKey: '67020bb5be8f6f358be9'
			},
			{
				name: 'Electricity bill',
				inmutableKey: '2795466d19a02edf91a2'
			},
			{
				name: 'Water bill',
				inmutableKey: '367152c689521a741912'
			},
			{
				name: 'Gas bill',
				inmutableKey: '09a4d2883e9605de3af5'
			},
			{
				name: 'ISP provider bill',
				inmutableKey: '649f5bae610a88cfafba'
			},
			{
				name: 'Home taxes',
				inmutableKey: 'd074eabc7b8e111bc6a5'
			},
			{
				name: 'Home insurance',
				inmutableKey: '79b8bc873e8aaf93e0d7'
			},
			{
				name: 'Taxes of the community of neighbors',
				inmutableKey: 'c9382b5849da8fb87c4b'
			},
			{
				name: 'Repairs and home works',
				inmutableKey: '6596560424b5a62054bb'
			},
			{
				name: 'Mortgage',
				inmutableKey: 'f6e025e8988d541e6e64'
			},
			{
				name: 'Rent',
				inmutableKey: '212d8beddfc1981bf3d2'
			}
		],
	},
	{
		name: 'Professional career',
		subcategories: [
			{
				name: 'English classes',
				inmutableKey: '0cdbdd7f2050a17778c9'
			},
			{
				name: 'Books, events, conferences, formative courses, certifications',
				inmutableKey: 'db5fa3a569a72dca9079'
			}
		],
	},
	{
		name: 'Recreational activities',
		subcategories: [
			{
				name: 'Bar, restaurants and pubs',
				inmutableKey: 'a90ae2812b970bd8d6f5'
			},
			{
				name: 'Gym and climbing wall',
				inmutableKey: '1f2db29fbcc94835f5ec'
			},
			{
				name: 'Books, events, cinema, music, concerts, museums, and other cultural activities',
				inmutableKey: '8764609f8c1456aa10ff'
			},
			{
				name: 'Camping, shelter',
				inmutableKey: 'd40c102031f4e79e23bc'
			},
			{
				name: 'Recreational courses and formative sessions (cooking, alpinism...)',
				inmutableKey: 'b2cbe8b45593c0b39b5e'
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
