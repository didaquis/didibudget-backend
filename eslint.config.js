import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es6,
			},
		},
		rules: {
			indent: [
				'error',
				'tab',
				{ SwitchCase: 1 }
			],
			'linebreak-style': [
				'error',
				'unix'
			],
			quotes: [
				'error',
				'single'
			],
			semi: [
				'error',
				'always'
			],
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
			curly: 'error',
		},
	},
	{
		files: ['tests/**/*.test.js'],
		languageOptions: {
			globals: {
				describe: 'readonly',
				test: 'readonly',
				it: 'readonly',
				expect: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				vi: 'readonly',
			},
		},
		rules: {
			'no-magic-numbers': 'off',
		},
	},
];
