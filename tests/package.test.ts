import { describe, expect, test, beforeAll } from 'vitest';
import jsonfile from 'jsonfile';

type JsonfileModule = {
	readFileSync: (file: string) => any;
};

const jsonfileReader = jsonfile as unknown as JsonfileModule;

let packageJSONData: any;

describe('package.json file', () => {

	beforeAll(() => {
		const file = './package.json';
		packageJSONData = jsonfileReader.readFileSync(file);
	});

	test('Should have all dependencies with semver version fixed', () => {
		if (packageJSONData.dependencies) {
			const validPattern = /^(\d+\.)(\d+\.)(\d+)$/;
			const regex = RegExp(validPattern);
	
			let allDependenciesAreFixed = true;
			for (const key in packageJSONData.dependencies){
				if (Object.prototype.hasOwnProperty.call(packageJSONData.dependencies, key)) {
					if (!regex.test(packageJSONData.dependencies[key])) {
						allDependenciesAreFixed = false;
					}
				}
			}
	
			expect(allDependenciesAreFixed).toBe(true);
		}
	});

	test('Should have all devDependencies with semver version fixed', () => {
		if (packageJSONData.devDependencies) {
			const validPattern = /^(\d+\.)(\d+\.)(\d+)/;
			const regex = RegExp(validPattern);

			let allDevDependenciesAreFixed = true;

			for (const key in packageJSONData.devDependencies){
				if (Object.prototype.hasOwnProperty.call(packageJSONData.devDependencies, key)) {
					if (!regex.test(packageJSONData.devDependencies[key])) {
						allDevDependenciesAreFixed = false;
					}
				}
			}

			expect(allDevDependenciesAreFixed).toBe(true);
		}
	});
});
