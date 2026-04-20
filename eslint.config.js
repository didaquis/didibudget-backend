const js = require('@eslint/js');

module.exports = [
	{
		ignores: ['node_modules/', 'logs/', 'dist/', 'eslint.config.js']
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: 'commonjs',
			globals: {
				// Node.js global variables
				require: 'readonly',
				module: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				clearInterval: 'readonly',
				clearTimeout: 'readonly',
				setInterval: 'readonly',
				setTimeout: 'readonly',
				console: 'readonly',
				global: 'readonly',
				// CommonJS modules
				exports: 'writable'
			}
		},
		rules: {
			...js.configs.recommended.rules,
			'indent': ['error', 'tab', { SwitchCase: 1 }],
			'linebreak-style': ['error', 'unix'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'no-console': 'warn',
			'no-alert': 'warn',
			'no-unused-vars': 'error',
			'keyword-spacing': ['error', { before: true, after: true }],
			'space-infix-ops': ['error', { int32Hint: false }],
			'comma-spacing': ['error'],
			'arrow-spacing': ['error'],
			'semi-spacing': ['error'],
			'space-before-function-paren': ['error'],
			'no-multi-spaces': 'error',
			'no-magic-numbers': ['warn', { ignore: [0], ignoreArrayIndexes: true }],
			'valid-typeof': 'error',
			'object-curly-spacing': ['error', 'always'],
			'curly': 'error',
			'no-return-await': 'error'
		}
	},
	{
		files: ['tests/**/*.js'],
		languageOptions: {
			globals: {
				describe: 'readonly',
				test: 'readonly',
				it: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly',
				expect: 'readonly',
				jest: 'readonly'
			}
		},
		rules: {
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
		}
	}
];
