import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: ['dist/**'],
	},
	{
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.eslint.json',
			},
			globals: {
				...globals.node,
				...globals.es6,
			},
		},
		files: ['src/**/*.ts', 'tests/**/*.ts'],
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
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'keyword-spacing': ['error', { before: true, after: true }],
			'space-infix-ops': ['error', { int32Hint: false }],
			'comma-spacing': ['error'],
			'arrow-spacing': ['error'],
			'semi-spacing': ['error'],
			'no-multi-spaces': 'error',
			'no-magic-numbers': ['warn', { ignore: [0], ignoreArrayIndexes: true }],
			'valid-typeof': 'error',
			'object-curly-spacing': ['error', 'always'],
			curly: 'error',
		},
	},
	{
		files: ['tests/**/*.test.ts'],
		rules: {
			'no-magic-numbers': 'off',
		},
	},
);
