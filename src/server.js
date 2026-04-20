'use strict';

const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const { ApolloServer, ApolloServerPluginLandingPageDisabled } = require('@apollo/server');
const { UserInputError } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

const { setContext } = require('./gql/auth/setContext');
const typeDefs = require('./gql/types/index');
const resolvers = require('./gql/resolvers/index');
const { getListOfIPV4Address } = require('./helpers/getListOfIPV4Address');
const routesManager = require('./routes/routesManager');
const { ENVIRONMENT } = require('./config/environment');
const { environmentVariablesConfig } = require('./config/appConfig');
const { expenseCategories } = require('./config/defaultData');
const { logger, endLogger } = require('./helpers/logger');
const { requestDevLogger } = require('./helpers/requestDevLogger');
const { upsertDBWithExpenseCategories } = require('./helpers/upsertDatabase');

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
db.on('error', (err) => {
	logger.error(`Connection error with database. ${err}`);
});

db.once('open', async () => {
	if (environmentVariablesConfig.environment !== ENVIRONMENT.DEVELOPMENT) {
		logger.info(`Connected with MongoDB service (${ENVIRONMENT.PRODUCTION} mode)`);
	} else {
		if (environmentVariablesConfig.formatConnection === 'DNSseedlist' && environmentVariablesConfig.mongoDNSseedlist !== '') {
			logger.info(`Connected with MongoDB service at "${environmentVariablesConfig.mongoDNSseedlist}" using database "${environmentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
		} else {
			logger.info(`Connected with MongoDB service at "${environmentVariablesConfig.dbHost}" in port "${environmentVariablesConfig.dbPort}" using database "${environmentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
		}
	}


	logger.info('Trying to upsert the database with default values...');
	await upsertDBWithExpenseCategories(expenseCategories);
	logger.info('The upsert of database has been finished.');

	initApplication();
});

const initApplication = async () => {
	const app = express();
	if (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) {
		app.use(helmet());
	} else {
		// Allow GraphQL Playground on development environments
		app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
	}
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors({ credentials: true }));
	app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use('', routesManager);

	const server = new ApolloServer({ 
		typeDefs,
		resolvers,
		introspection: (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) ? false : true, // Set to "true" only in development mode
		plugins: (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) ? [ApolloServerPluginLandingPageDisabled()] : [requestDevLogger], // Log all querys and their responses. Show playground (do not use in production)
		formatError (error) {
			if ( !(error.originalError instanceof UserInputError) ) {
				logger.error(error.message);
			}

			return error;
		},
	});

	await server.start();

	app.use(
		'/graphql',
		cors({ credentials: true }),
		expressMiddleware(server, {
			context: setContext,
		})
	);

	app.use((req, res) => {
		res.status(404).send('404'); // eslint-disable-line no-magic-numbers
	});

	app.listen(environmentVariablesConfig.port, () => {
		getListOfIPV4Address().forEach(ip => {
			logger.info(`Application running on: http://${ip}:${environmentVariablesConfig.port}`);
			if (environmentVariablesConfig.environment !== ENVIRONMENT.PRODUCTION) {
				logger.info(`GraphQL Playground running on: http://${ip}:${environmentVariablesConfig.port}/graphql`);
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
