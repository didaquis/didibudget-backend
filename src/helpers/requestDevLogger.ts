import type { ApolloServerPlugin, GraphQLRequestListener, BaseContext } from 'apollo-server-plugin-base';
import type { GraphQLRequestContext, GraphQLRequestContextWillSendResponse } from 'apollo-server-types';
import type { GraphQLFormattedError } from 'graphql';

import { logger } from './logger.js';

const formatResponse = (requestContext: GraphQLRequestContextWillSendResponse<BaseContext>): string => {
	const space = 2;
	return JSON.stringify(requestContext.response.data, null, space);
};

export const requestDevLogger: ApolloServerPlugin<BaseContext> = {
	// Fires whenever a GraphQL request is received from a client
	async requestDidStart (requestContext: GraphQLRequestContext<BaseContext>): Promise<GraphQLRequestListener<BaseContext> | void> {

		/* List of regex to filter queries from logger */
		const excludeThisQueryFromLogger = [/query IntrospectionQuery/];

		if (!requestContext.request.query) {
			return;
		}

		const avoidLog = excludeThisQueryFromLogger.some(excludedQuery => requestContext.request.query!.match(excludedQuery));

		if (avoidLog) {
			return;
		}

		logger.debug('Query:');
		logger.debug(`\n${requestContext.request.query}`);

		logger.debug('Variables:');
		logger.debug(requestContext.request.variables);

		return {
			// Fires whenever Apollo Server is about to send a response for a GraphQL operation
			async willSendResponse (requestContext: GraphQLRequestContextWillSendResponse<BaseContext>): Promise<void> {
				logger.debug('Response data:');
				logger.debug(formatResponse(requestContext));

				if (requestContext.response.errors) {
					logger.debug(`Response errors (number of errors: ${requestContext.response.errors.length}):`);
					requestContext.response.errors.forEach((err: GraphQLFormattedError) => logger.debug(err.message));
				}
			}
		};
	}
};
