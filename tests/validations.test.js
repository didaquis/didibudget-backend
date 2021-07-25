const { authValidations } = require('../src/gql/auth/validations');

describe('validations', () => {
	test('Should be an object', () => {
		const whatTypeIs = (element) => {
			// eslint-disable-next-line no-magic-numbers
			return Object.prototype.toString.call(element).slice(8, -1);
		};

		expect(whatTypeIs(authValidations) === 'Object').toBe(true);
	});

	describe('isValidEmail', () => {
		test('Should return false if no receive params', () => {
			expect(authValidations.isValidEmail()).toBe(false);
		});

		const noValidData = ['foo', '', 'foo@@foo.foo', 'bar@bar..com', 'biz@biz.', '@foo.mail'];
		test.each(noValidData)(
			'Should return false if no receive a valid data. Data: %p',
			(data) => {
				expect(authValidations.isValidEmail(data)).toBe(false);
			}
		);


		const validData = ['maria@mail.com', 'john.doe@gmail.com', 'santi72@hotmail.es', 'foo_@yourcompany.it'];
		test.each(validData)(
			'Should return true if receive a valid data. Data: %p',
			(data) => {
				expect(authValidations.isValidEmail(data)).toBe(true);
			}
		);
	});

	describe('isStrongPassword', () => {
		test('Should return false if no receive params', () => {
			expect(authValidations.isStrongPassword()).toBe(false);
		});

		test('Should return false if no receive a valid data', () => {
			const fakeData = ['foo', '', '123', 'patata', 'PATATA.', '*', 'Pa1*', 'A2*aaaa', 'abcdefghijkl', 'My-Password', '82569285927659'];

			fakeData.forEach( data => {
				expect(authValidations.isStrongPassword(data)).toBe(false);
			});
		});

		test('Should return true if receive a valid data', () => {
			const fakeData = ['abcABC123', 'Pat*ta_72', 'Lol#u&8$', 'My-P4ssw0rd', 'w!w_393_MiM', '*ZGw2sEse!uE', 'ByRN*e&M4%xD', 'syW_ntrq-^LEW8D7', 'ExNbNJa8^mtp3f#e', 'gsY*AL-J9A7?-h2c', 'y6XQw+3H4Cef#QCtudX8ZPF5', '34mDnZTPecVpnxmvwGMW9mWY5g', 'jw2AFhSB'];

			fakeData.forEach( data => {
				expect(authValidations.isStrongPassword(data)).toBe(true);
			});
		});
	});
});