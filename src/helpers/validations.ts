/**
 * Check if email is valid.
 */
export const isValidEmail = (email?: string | null): boolean => {
	if (!email) {
		return false;
	}
	const emailValidPattern = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
	return emailValidPattern.test(email);
};

/**
 * Check if password is secure. Rules: At least 8 characters. It must contain numbers, lowercase letters and uppercase letters. The spaces are not allowed. Only english characters are allowed. This characters are not allowed: { } ( ) | ~ € ¿ ¬
 */
export const isStrongPassword = (password?: string | null): boolean => {
	if (!password) {
		return false;
	}
	const passwordValidPattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!*^?+-_@#$%&]{8,}$/);
	return passwordValidPattern.test(password);
};
