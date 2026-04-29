import os from 'os';

/**
 * Get all IP address of the server
 */
export const getListOfIPV4Address = ({ skipLocalhost = false }: { skipLocalhost?: boolean } = {}): string[] => {
	const ifaces = os.networkInterfaces();

	const result: string[] = [];

	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname]!.forEach(function (iface) {
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
