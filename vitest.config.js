import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'#': path.resolve(import.meta.dirname, './src'),
		},
	},
	test: {
		environment: 'node',
		projects: [
			{
				extends: true,
				test: { name: 'default', include: ['tests/**/*.test.ts'] },
			},
			{
				// Proves the day helpers do not depend on the process timezone
				extends: true,
				test: {
					name: 'tz-auckland',
					include: ['tests/helpers/spendingDay.test.ts'],
					env: { TZ: 'Pacific/Auckland' },
				},
			},
		],
	},
});
