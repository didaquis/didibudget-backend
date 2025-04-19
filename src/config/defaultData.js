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
 * @property {string} name - The name of the expense category
 * @property {string} inmutableKey - The immutable key of the expense category
 * @property {Array<Object>} subcategories - An array of subcategories for the expense category
 * @property {string} subcategories.name - The name of the subcategory
 * @property {string} subcategories.inmutableKey - The immutable key of the subcategory
 */
const expenseCategories = [
	{
		name: 'Computers, smartphones and electronic devices',
		inmutableKey: '1dc0abadd6f2356c6914',
		subcategories: [],
		emojis: ['💻', '📱'],
	},
	{
		name: 'Mobile phone cost (calls and internet cost, not devices)',
		inmutableKey: '12ad85ba7fc3558e2ba6',
		subcategories: [],
		emojis: ['📞'],
	},
	{
		name: 'Applications, software and subscriptions to online services',
		inmutableKey: '24e8a627aabdd4370447',
		subcategories: [],
		emojis: ['🌎']
	},
	{
		name: 'Presents, gifts',
		inmutableKey: 'c5bf0c86462c81bbf19d',
		subcategories: [],
		emojis: ['🎁'],
	},
	{
		name: 'Medicines and health care services',
		inmutableKey: '9026b3ddcbc54ce40d06',
		subcategories: [],
		emojis: ['💊'],
	},
	{
		name: 'Clothes and shoes',
		inmutableKey: '5994fff85b0d42de2275',
		subcategories: [],
		emojis: ['👕', '👟'],
	},
	{
		name: 'Public transport',
		inmutableKey: 'c54d86b43ff86c7af807',
		subcategories: [],
		emojis: ['🚇', '🚌'],
	},
	{
		name: 'Private vehicles',
		inmutableKey: '15cd0a1ee1d250239b19',
		subcategories: [
			{
				name: 'Vehicle taxes, technical inspection',
				inmutableKey: '2c0f7ea86b62582c2308',
				emojis: ['🧾'],
			},
			{
				name: 'Vehicle insurance',
				inmutableKey: '55ba8bddc746c078ebc6',
				emojis: ['🧾'],
			},
			{
				name: 'Spare parts, maintenance and cleaning costs',
				inmutableKey: '0176bf56861cfc5ef72d',
				emojis: ['🔧'],
			},
			{
				name: 'Garage',
				inmutableKey: '2bcd348acfe1bf3e7aec',
				emojis: ['🏢'],
			},
			{
				name: 'Vehicle cost (renting, leasing, bank loan)',
				inmutableKey: '3fd1f7e8e2f828cbe212',
				emojis: ['🚙'],
			},
			{
				name: 'Down payment for the vehicle',
				inmutableKey: 'bc0670da0b15f4b6c201',
				emojis: ['🔑', '🚙'],
			},
			{
				name: 'Fuel',
				inmutableKey: '6f4ab3b2b1b3268d9138',
				emojis: ['⛽️'],
			},
			{
				name: 'Tolls, parkings and tunnels',
				inmutableKey: 'a54b87aab3bf45fa393b',
				emojis: ['🅿️'],
			}
		],
		emojis: ['🚙'],
	},
	{
		name: 'Travels & holidays & weekend breaks',
		inmutableKey: 'c7f2653ce6672c5b1e52',
		subcategories: [],
		emojis: ['🧳'],
	},
	{
		name: 'Home',
		inmutableKey: '80a6d32180f700494c59',
		subcategories: [
			{
				name: 'Groceries, cleaning products, personal care products, objects, tools and cookware',
				inmutableKey: '3e8e136c59a6d961c0cd',
				emojis: ['🍋', '🧹'],
			},
			{
				name: 'Appliances and furniture',
				inmutableKey: '67020bb5be8f6f358be9',
				emojis: ['🪑', '📺'],
			},
			{
				name: 'Electricity bill',
				inmutableKey: '2795466d19a02edf91a2',
				emojis: ['⚡️'],
			},
			{
				name: 'Water bill',
				inmutableKey: '367152c689521a741912',
				emojis: ['💧'],
			},
			{
				name: 'Gas bill',
				inmutableKey: '09a4d2883e9605de3af5',
				emojis: ['💨'],
			},
			{
				name: 'ISP provider bill (including TV, landline, and mobile phone)',
				inmutableKey: '649f5bae610a88cfafba',
				emojis: ['🌐'],
			},
			{
				name: 'Down payment for the house',
				inmutableKey: '58c16c7f1b255d90dd3d',
				emojis: ['🔑', '🏠'],
			},
			{
				name: 'Home taxes (includes garage)',
				inmutableKey: 'd074eabc7b8e111bc6a5',
				emojis: ['🧾'],
			},
			{
				name: 'Home insurance',
				inmutableKey: '79b8bc873e8aaf93e0d7',
				emojis: ['🧾'],
			},
			{
				name: 'Taxes of the community of neighbors (includes garage)',
				inmutableKey: 'c9382b5849da8fb87c4b',
				emojis: ['🧾'],
			},
			{
				name: 'Repairs and home works',
				inmutableKey: '6596560424b5a62054bb',
				emojis: ['🛠️'],
			},
			{
				name: 'Mortgage',
				inmutableKey: 'f6e025e8988d541e6e64',
				emojis: ['🏠'],
			},
			{
				name: 'Mortgage amortization',
				inmutableKey: '3a559a96cc40fd784196',
				emojis: ['🏠', '⏩'],
			},
			{
				name: 'Rent',
				inmutableKey: '212d8beddfc1981bf3d2',
				emojis: ['🔑'],
			}
		],
		emojis: ['🏠'],
	},
	{
		name: 'Professional career',
		inmutableKey: 'bb8c65f28a8aa0bf5c7b',
		subcategories: [
			{
				name: 'English classes',
				inmutableKey: '0cdbdd7f2050a17778c9',
				emojis: ['🇬🇧'],
			},
			{
				name: 'Books, events, conferences, formative courses, certifications',
				inmutableKey: 'db5fa3a569a72dca9079',
				emojis: ['📚', '🎟️'],
			}
		],
		emojis: ['👷🏻'],
	},
	{
		name: 'Leisure activities',
		inmutableKey: 'e2e8bfc9317cb340353a',
		subcategories: [
			{
				name: 'Bar, restaurants and pubs',
				inmutableKey: 'a90ae2812b970bd8d6f5',
				emojis: ['🍺'],
			},
			{
				name: 'Gym and climbing wall',
				inmutableKey: '1f2db29fbcc94835f5ec',
				emojis: ['🤸🏻'],
			},
			{
				name: 'Cinema, concerts, museums, and other cultural activities',
				inmutableKey: '8764609f8c1456aa10ff',
				emojis: ['🍿', '🎺'],
			},
			{
				name: 'Camping, shelter',
				inmutableKey: 'd40c102031f4e79e23bc',
				emojis: ['⛺️'],
			},
			{
				name: 'Recreational courses and formative sessions (cooking, alpinism, chess...)',
				inmutableKey: 'b2cbe8b45593c0b39b5e',
				emojis: ['🧑🏻‍🎓'],
			},
			{
				name: 'Social gathering',
				inmutableKey: 'c5e7cadebd4b038ee612',
				emojis: ['👨‍👩‍👧‍👦', '🎳', '🥂'],
			}
		],
		emojis: ['🍿', '🎳'],
	},
	{
		name: 'Leisure items',
		inmutableKey: '1d4edab5238364fbd183',
		subcategories: [
			{
				name: 'Books, music albums, videogames',
				inmutableKey: '55627d062a7a11a8c1c8',
				emojis: ['📚', '💿', '👾'],
			},
			{
				name: 'Puzzles, board games',
				inmutableKey: 'a6dea8416e7616662843',
				emojis: ['🧩', '♟️'],
			},
			{
				name: 'Collectibles, hobby items',
				inmutableKey: 'f40a284425ea71685ab5',
				emojis: ['🪙', '🪆']
			},
			{
				name: 'Adult toys, pleasure goods',
				inmutableKey: '4962cd0b5929cdf151ee',
				emojis: ['🌶️']
			}
		],
		emojis: ['📚', '🧩'],
	},
	{
		name: 'Sports equipment (including boots and jackets)',
		inmutableKey: '7bc8a8ada1b72ddaffe9',
		subcategories: [],
		emojis: ['🎿'],
	},
	{
		name: 'Other expenses',
		inmutableKey: '2e1927ef52320e0e1507',
		subcategories: [],
		emojis: ['🕳️'],
	},
	{
		name: 'Bank charges (commissions)',
		inmutableKey: 'dd388ee7192bcc12a247',
		subcategories: [],
		emojis: ['🏦'],
	},
	{
		name: 'Government taxes',
		inmutableKey: '404e021b5b22684ab693',
		subcategories: [],
		emojis: ['🧾'],
	},
	{
		name: 'Personal insurance (sport, life...)',
		inmutableKey: '34a770c7aaecba94391f',
		subcategories: [],
		emojis: ['🧾'],
	},
	{
		name: 'Retirement plan and savings plan',
		inmutableKey: 'ecc399bcb94fbd2cfd6b',
		subcategories: [],
		emojis: ['💰'],
	},
	{
		name: 'Lawyers and public notaries',
		inmutableKey: '6308b902aef65f9fa489',
		subcategories: [],
		emojis: ['🧑🏻‍⚖️'],
	},
];

/** Default data for database */
module.exports = { expenseCategories };
