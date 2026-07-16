import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import path from 'path';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import type { GraphQLFormattedError } from 'graphql';

import { setContext } from './gql/auth/setContext.js';
import type { Context } from './gql/auth/setContext.js';
import typeDefs from './gql/types/index.js';
import resolvers from './gql/resolvers/index.js';
import { getListOfIPV4Address } from './helpers/getListOfIPV4Address.js';
import routesManager from './routes/routesManager.js';
import { ENVIRONMENT } from './config/environment.js';
import { environmentVariablesConfig, securityVariablesConfig, ensureJwtSecretIsSecure } from './config/appConfig.js';
import { expenseCategories } from './config/defaultData.js';
import { logger, endLogger } from './helpers/logger.js';
import { requestDevLogger } from './helpers/requestDevLogger.js';
import { createDatabaseIndexes, upsertDBWithExpenseCategories } from './helpers/upsertDatabase.js';

try {
	ensureJwtSecretIsSecure(securityVariablesConfig.secret, environmentVariablesConfig.environment);
} catch (err) {
	logger.error(`Startup failed: ${(err as Error).message}`);
	const EXIT_CODE_FAILURE = 1;
	process.exit(EXIT_CODE_FAILURE);
}

mongoose.set('strictQuery', true);

if (environmentVariablesConfig.formatConnection === 'DNSseedlist' && environmentVariablesConfig.mongoDNSseedlist !== '') {
	mongoose.connect(environmentVariablesConfig.mongoDNSseedlist);
} else {
	if (environmentVariablesConfig.mongoUser !== '' && environmentVariablesConfig.mongoPass !== '') {
		mongoose.connect(`mongodb://${environmentVariablesConfig.mongoUser}:${environmentVariablesConfig.mongoPass}@${environmentVariablesConfig.dbHost}:${environmentVariablesConfig.dbPort}/${environmentVariablesConfig.database}`);
	} else {
		mongoose.connect(`mongodb://${environmentVariablesConfig.dbHost}:${environmentVariablesConfig.dbPort}/${environmentVariablesConfig.database}`);
	}
}

const db = mongoose.connection;
db.on('error', (err: Error) => {
	logger.error(`Connection error with database. ${err}`);
});

db.once('open', async () => {
	try {
		if (environmentVariablesConfig.environment !== ENVIRONMENT.DEVELOPMENT) {
			logger.info(`Connected with MongoDB service (${ENVIRONMENT.PRODUCTION} mode)`);
		} else {
			if (environmentVariablesConfig.formatConnection === 'DNSseedlist' && environmentVariablesConfig.mongoDNSseedlist !== '') {
				logger.info(`Connected with MongoDB service at "${environmentVariablesConfig.mongoDNSseedlist}" using database "${environmentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
			} else {
				logger.info(`Connected with MongoDB service at "${environmentVariablesConfig.dbHost}" in port "${environmentVariablesConfig.dbPort}" using database "${environmentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
			}
		}


		logger.info('Ensuring database indexes...');
		await createDatabaseIndexes();
		logger.info('Database indexes are up to date.');

		logger.info('Trying to upsert the database with default values...');
		await upsertDBWithExpenseCategories(expenseCategories);
		logger.info('The upsert of database has been finished.');

		initApplication();
	} catch (err) {
		logger.error(`Startup failed: ${err}`);
		const EXIT_CODE_FAILURE = 1;
		process.exit(EXIT_CODE_FAILURE);
	}
});

const graphqlPath = '/graphql';

const initApplication = async (): Promise<void> => {
	const app = express();
	// Trust the single reverse proxy in front of the app (e.g. the Heroku router) so that req.ip
	// reflects the real client IP from X-Forwarded-For. This is required for per-client login rate
	// limiting to work; without it every request would appear to come from the proxy. Increase this
	// number if additional trusted proxies are ever placed in front of the app.
	const trustedProxyHops = 1;
	app.set('trust proxy', trustedProxyHops);
	if (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) {
		app.use(helmet());
	} else {
		// Allow the Apollo Sandbox IDE on development environments
		app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
	}
	app.use(cors({ credentials: true }));
	app.use(favicon(path.join(import.meta.dirname, 'public', 'favicon.ico')));
	app.use('', routesManager);

	const server = new ApolloServer<Context>({
		typeDefs,
		resolvers,
		introspection: (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) ? false : true, // Set to "true" only in development mode
		plugins: (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) ? [ApolloServerPluginLandingPageDisabled()] : [requestDevLogger, ApolloServerPluginLandingPageLocalDefault()], // Log all querys and their responses. Show Apollo Sandbox (do not use in production)
		formatError(formattedError: GraphQLFormattedError): GraphQLFormattedError {
			// User input errors are expected; everything else is logged as a server-side error
			if (formattedError.extensions?.code !== 'BAD_USER_INPUT') {
				logger.error(formattedError.message);
			}

			return formattedError;
		},
	});

	await server.start();

	app.use(graphqlPath, express.json(), expressMiddleware(server, { context: setContext }));

	app.use((req: Request, res: Response) => {
		res.status(404).send('404'); // eslint-disable-line no-magic-numbers
	});

	app.listen(environmentVariablesConfig.port, () => {
		getListOfIPV4Address().forEach(ip => {
			logger.info(`Application running on: http://${ip}:${environmentVariablesConfig.port}`);
			if (environmentVariablesConfig.environment !== ENVIRONMENT.PRODUCTION) {
				logger.info(`GraphQL Sandbox running on: http://${ip}:${environmentVariablesConfig.port}${graphqlPath}`);
			}
		});
	});

	// Managing application shutdown
	process.on('SIGINT', () => {
		logger.info('Stopping application...');
		endLogger();
		process.exit();
	});
};
