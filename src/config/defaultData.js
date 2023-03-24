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
		inmutableKey: '1dc0abadd6f2356c6914',
		subcategories: [],
	},
	{
		name: 'Mobile phone cost (calls and internet cost, not devices)',
		inmutableKey: '12ad85ba7fc3558e2ba6',
		subcategories: [],
	},
	{
		name: 'Applications, software and subscriptions to online services',
		inmutableKey: '24e8a627aabdd4370447',
		subcategories: [],
	},
	{
		name: 'Presents, gifts',
		inmutableKey: 'c5bf0c86462c81bbf19d',
		subcategories: [],
	},
	{
		name: 'Medicines and health care services',
		inmutableKey: '9026b3ddcbc54ce40d06',
		subcategories: [],
	},
	{
		name: 'Clothes and shoes',
		inmutableKey: '5994fff85b0d42de2275',
		subcategories: [],
	},
	{
		name: 'Public transport',
		inmutableKey: 'c54d86b43ff86c7af807',
		subcategories: [],
	},
	{
		name: 'Private vehicles',
		inmutableKey: '15cd0a1ee1d250239b19',
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
				name: 'Spare parts, maintenance and cleaning costs',
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
		inmutableKey: 'c7f2653ce6672c5b1e52',
		subcategories: [],
	},
	{
		name: 'Home',
		inmutableKey: '80a6d32180f700494c59',
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
				name: 'ISP provider bill (including TV, landline, and mobile phone)',
				inmutableKey: '649f5bae610a88cfafba'
			},
			{
				name: 'Home taxes (includes garage)',
				inmutableKey: 'd074eabc7b8e111bc6a5'
			},
			{
				name: 'Home insurance',
				inmutableKey: '79b8bc873e8aaf93e0d7'
			},
			{
				name: 'Taxes of the community of neighbors (includes garage)',
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
		inmutableKey: 'bb8c65f28a8aa0bf5c7b',
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
		inmutableKey: 'e2e8bfc9317cb340353a',
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
		inmutableKey: '7bc8a8ada1b72ddaffe9',
		subcategories: [],
	},
	{
		name: 'Other expenses',
		inmutableKey: '2e1927ef52320e0e1507',
		subcategories: [],
	},
	{
		name: 'Bank charges (commissions)',
		inmutableKey: 'dd388ee7192bcc12a247',
		subcategories: [],
	},
	{
		name: 'Government taxes',
		inmutableKey: '404e021b5b22684ab693',
		subcategories: [],
	},
	{
		name: 'Personal insurance (sport, life...)',
		inmutableKey: '34a770c7aaecba94391f',
		subcategories: [],
	},
	{
		name: 'Retirement plan and savings plan',
		inmutableKey: 'ecc399bcb94fbd2cfd6b',
		subcategories: [],
	},
	{
		name: 'Lawyers and public notaries',
		inmutableKey: '6308b902aef65f9fa489',
		subcategories: [],
	},
];

/** Default data for database */
module.exports = { expenseCategories };
