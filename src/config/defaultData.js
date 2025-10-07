'use strict';

const { CategoryType } = require('../data/CategoryType');

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
 * @property {Array<string>} emojis - Some emojis to identify category
 * @property {Array<Object>} subcategories - An array of subcategories for the expense category
 * @property {string} subcategories.name - The name of the subcategory
 * @property {string} subcategories.inmutableKey - The immutable key of the subcategory
 * @property {Array<string>} subcategories.emojis - Some emojis to identify subcategory
 */
const expenseCategories = [
	{
		name: 'Computers, smartphones and electronic devices',
		inmutableKey: '1dc0abadd6f2356c6914',
		subcategories: [],
		emojis: ['💻', '📱'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Mobile phone cost (calls and internet cost, not devices)',
		inmutableKey: '12ad85ba7fc3558e2ba6',
		subcategories: [],
		emojis: ['📞'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Applications, software and subscriptions to online services',
		inmutableKey: '24e8a627aabdd4370447',
		subcategories: [],
		emojis: ['🌎'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Presents, gifts',
		inmutableKey: 'c5bf0c86462c81bbf19d',
		subcategories: [],
		emojis: ['🎁'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Medicines and health care services',
		inmutableKey: '9026b3ddcbc54ce40d06',
		subcategories: [],
		emojis: ['💊'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Clothes and shoes',
		inmutableKey: '5994fff85b0d42de2275',
		subcategories: [],
		emojis: ['👕', '👟'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Public transport',
		inmutableKey: 'c54d86b43ff86c7af807',
		subcategories: [],
		emojis: ['🚇', '🚌'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Private vehicles',
		inmutableKey: '15cd0a1ee1d250239b19',
		subcategories: [
			{
				name: 'Vehicle taxes, technical inspection',
				inmutableKey: '2c0f7ea86b62582c2308',
				emojis: ['🧾'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Vehicle insurance',
				inmutableKey: '55ba8bddc746c078ebc6',
				emojis: ['🧾'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Spare parts, maintenance and cleaning costs',
				inmutableKey: '0176bf56861cfc5ef72d',
				emojis: ['🔧'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Garage',
				inmutableKey: '2bcd348acfe1bf3e7aec',
				emojis: ['🏢'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Vehicle cost (renting, leasing, bank loan)',
				inmutableKey: '3fd1f7e8e2f828cbe212',
				emojis: ['🚙'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Down payment for the vehicle',
				inmutableKey: 'bc0670da0b15f4b6c201',
				emojis: ['🔑', '🚙'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Fuel',
				inmutableKey: '6f4ab3b2b1b3268d9138',
				emojis: ['⛽️'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Tolls, parkings and tunnels',
				inmutableKey: 'a54b87aab3bf45fa393b',
				emojis: ['🅿️'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Traffic fine',
				inmutableKey: 'f498df31992c29f633d8',
				emojis: ['🔖', '⚠️'],
				categoryType: CategoryType.EXPENSE,
			}
		],
		emojis: ['🚙'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Travels & holidays & weekend breaks',
		inmutableKey: 'c7f2653ce6672c5b1e52',
		subcategories: [],
		emojis: ['🧳'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Home',
		inmutableKey: '80a6d32180f700494c59',
		subcategories: [
			{
				name: 'Cleaning products, objects, tools and cookware',
				inmutableKey: '3e8e136c59a6d961c0cd',
				emojis: ['🧹', '🍴', '🪴'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Appliances and furniture',
				inmutableKey: '67020bb5be8f6f358be9',
				emojis: ['🪑', '📺'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Electricity bill',
				inmutableKey: '2795466d19a02edf91a2',
				emojis: ['⚡️'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Water bill',
				inmutableKey: '367152c689521a741912',
				emojis: ['💧'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Gas bill',
				inmutableKey: '09a4d2883e9605de3af5',
				emojis: ['💨'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'ISP provider bill (including TV, landline, and mobile phone)',
				inmutableKey: '649f5bae610a88cfafba',
				emojis: ['🌐'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Down payment for the house',
				inmutableKey: '58c16c7f1b255d90dd3d',
				emojis: ['🔑', '🏠'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Home taxes (includes garage)',
				inmutableKey: 'd074eabc7b8e111bc6a5',
				emojis: ['🧾'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Home insurance',
				inmutableKey: '79b8bc873e8aaf93e0d7',
				emojis: ['🧾'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Taxes of the community of neighbors (includes garage)',
				inmutableKey: 'c9382b5849da8fb87c4b',
				emojis: ['🧾'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Repairs and home works',
				inmutableKey: '6596560424b5a62054bb',
				emojis: ['🛠️'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Mortgage',
				inmutableKey: 'f6e025e8988d541e6e64',
				emojis: ['🏠'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Mortgage amortization',
				inmutableKey: '3a559a96cc40fd784196',
				emojis: ['🏠', '⏩'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Rent',
				inmutableKey: '212d8beddfc1981bf3d2',
				emojis: ['🔑'],
				categoryType: CategoryType.EXPENSE,
			}
		],
		emojis: ['🏠'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Professional career',
		inmutableKey: 'bb8c65f28a8aa0bf5c7b',
		subcategories: [
			{
				name: 'English classes',
				inmutableKey: '0cdbdd7f2050a17778c9',
				emojis: ['🇬🇧'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Books, events, conferences, formative courses, certifications',
				inmutableKey: 'db5fa3a569a72dca9079',
				emojis: ['📚', '🎟️'],
				categoryType: CategoryType.EXPENSE,
			}
		],
		emojis: ['👷🏻'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Leisure activities',
		inmutableKey: 'e2e8bfc9317cb340353a',
		subcategories: [
			{
				name: 'Bar, restaurants and pubs',
				inmutableKey: 'a90ae2812b970bd8d6f5',
				emojis: ['🍺'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Gym and climbing wall',
				inmutableKey: '1f2db29fbcc94835f5ec',
				emojis: ['🤸🏻'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Cinema, concerts, museums, and other cultural activities',
				inmutableKey: '8764609f8c1456aa10ff',
				emojis: ['🍿', '🎺'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Camping, shelter',
				inmutableKey: 'd40c102031f4e79e23bc',
				emojis: ['⛺️'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Recreational courses and formative sessions (cooking, alpinism, chess...)',
				inmutableKey: 'b2cbe8b45593c0b39b5e',
				emojis: ['🧑🏻‍🎓'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Social gathering',
				inmutableKey: 'c5e7cadebd4b038ee612',
				emojis: ['👨‍👩‍👧‍👦', '🎳', '🥂'],
				categoryType: CategoryType.EXPENSE,
			}
		],
		emojis: ['🍿', '🎳'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Leisure items',
		inmutableKey: '1d4edab5238364fbd183',
		subcategories: [
			{
				name: 'Books, music albums, videogames',
				inmutableKey: '55627d062a7a11a8c1c8',
				emojis: ['📚', '💿', '👾'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Puzzles, board games',
				inmutableKey: 'a6dea8416e7616662843',
				emojis: ['🧩', '♟️'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Collectibles, hobby items',
				inmutableKey: 'f40a284425ea71685ab5',
				emojis: ['🪙', '🪆'],
				categoryType: CategoryType.EXPENSE,
			},
			{
				name: 'Adult toys, pleasure goods',
				inmutableKey: '4962cd0b5929cdf151ee',
				emojis: ['🌶️'],
				categoryType: CategoryType.EXPENSE,
			}
		],
		emojis: ['📚', '🧩'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Sports equipment (including boots and jackets)',
		inmutableKey: '7bc8a8ada1b72ddaffe9',
		subcategories: [],
		emojis: ['🎿'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Other expenses',
		inmutableKey: '2e1927ef52320e0e1507',
		subcategories: [],
		emojis: ['🕳️'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Bank charges (commissions)',
		inmutableKey: 'dd388ee7192bcc12a247',
		subcategories: [],
		emojis: ['🏦'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Government taxes & fees',
		inmutableKey: '404e021b5b22684ab693',
		subcategories: [],
		emojis: ['🧾'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Personal insurance (sport, life...)',
		inmutableKey: '34a770c7aaecba94391f',
		subcategories: [],
		emojis: ['🧾'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Retirement plan',
		inmutableKey: 'ecc399bcb94fbd2cfd6b',
		subcategories: [],
		emojis: ['💰', '👴🏻'],
		categoryType: CategoryType.SAVING,
	},
	{
		name: 'Lawyers and public notaries',
		inmutableKey: '6308b902aef65f9fa489',
		subcategories: [],
		emojis: ['🧑🏻‍⚖️'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Groceries, personal care products',
		inmutableKey: 'ab457aafab30faba7f34',
		subcategories: [],
		emojis: ['🍋', '🪥'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Lotteries, bets, and gambling',
		inmutableKey: '4948e614541c4f4fee8e',
		subcategories: [],
		emojis: ['🎲', '🍀'],
		categoryType: CategoryType.EXPENSE,
	},
	{
		name: 'Portfolio investment',
		inmutableKey: '226d36644d1469f27664',
		subcategories: [],
		emojis: ['💰', '💼'],
		categoryType: CategoryType.INVESTMENT,
	},
];

/** Default data for database */
module.exports = { expenseCategories };
