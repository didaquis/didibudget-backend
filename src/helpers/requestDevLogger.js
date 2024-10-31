const { logger } = require('./logger');

const formatResponse = (requestContext) => {
	const space = 2;
	return JSON.stringify(requestContext.response.data, null, space);
};


const requestDevLogger = {
	// Fires whenever a GraphQL request is received from a client
	requestDidStart (requestContext) {

		/* List of regex to filter queries from logger */
		const excludeThisQueryFromLogger = [/query IntrospectionQuery/];

		const avoidLog = excludeThisQueryFromLogger.some(excludedQuery => requestContext.request.query.match(excludedQuery));

		if (avoidLog) {
			return;
		}

		logger.debug('Query:');
		logger.debug(`\n${requestContext.request.query}`);

		logger.debug('Variables:');
		logger.debug(requestContext.request.variables);

		return {
			// Fires whenever Apollo Server is about to send a response for a GraphQL operation
			willSendResponse (requestContext) {
				logger.debug('Response data:');
				logger.debug(formatResponse(requestContext));

				if (requestContext.response.errors) {
					logger.debug(`Response errors (number of errors: ${requestContext.response.errors.length}):`);
					requestContext.response.errors.forEach(err => logger.debug(err.message));
				}
			}
		};
	}
};

module.exports = { requestDevLogger };
