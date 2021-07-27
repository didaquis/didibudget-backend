'use strict';

/**
 * Get all IP address of the server
 * @param {Object|undefined} [{}] - An object.
 * @param {Boolean} [obj.skipLocalhost=false] - Determines if the localhost address is returned in the result list
 * @return {Array}                          Array of IPs
 */
const getListOfIPV4Address = ({ skipLocalhost = false } = {}) => {
	const os = require('os');
	const ifaces = os.networkInterfaces();

	let result = [];

	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname].forEach(function (iface) {
			// skip non-ipv4 addresses
			if ('IPv4' !== iface.family) {
				return;
			}

			if (skipLocalhost) {
				// skip over internal (i.e. 127.0.0.1)
				if (iface.internal !== false) {
					return;
				}
			}

			result.push(iface.address);
		});
	});

	return result;
};


/**
 * Check if email is valid.
 * @param  {String} email
 * @return {Boolean}
 */
const isValidEmail = (email) => {
	if (!email) {
		return false;
	}
	const emailValidPattern = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
	return emailValidPattern.test(email);
};

/**
 * Check if password is secure. Rules: At least 8 characters. It must contain numbers, lowercase letters and uppercase letters. The spaces are not allowed. Only english characters are allowed. This characters are not allowed: { } ( ) | ~ € ¿ ¬
 * @param  {String} password
 * @return {Boolean}
 */
const isStrongPassword = (password) => {
	if (!password) {
		return false;
	}
	const passwordValidPattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!*^?+-_@#$%&]{8,}$/);
	return passwordValidPattern.test(password);
};

module.exports = { getListOfIPV4Address, isValidEmail, isStrongPassword };
