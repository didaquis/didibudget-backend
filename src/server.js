'use strict';

const mongoose = require('mongoose');

const { ENVIRONMENT } = require('./config/environment');
const { enviromentVariablesConfig } = require('./config/appConfig');
const expenseCategories = require('./config/defaultData');
const { logger, endLogger } = require('./helpers/logger');
const { requestDevLogger } = require('./helpers/requestDevLogger');
const { upsertDBWithExpenseCategories } = require('./helpers/upsertDatabase');


const mongooseConnectOptions = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
if (enviromentVariablesConfig.formatConnection === 'DNSseedlist' && enviromentVariablesConfig.mongoDNSseedlist !== '') {
	mongoose.connect(enviromentVariablesConfig.mongoDNSseedlist, mongooseConnectOptions);
} else {
	if (enviromentVariablesConfig.mongoUser !== '' && enviromentVariablesConfig.mongoPass !== '') {
		mongoose.connect(`mongodb://${enviromentVariablesConfig.mongoUser}:${enviromentVariablesConfig.mongoPass}@${enviromentVariablesConfig.dbHost}:${enviromentVariablesConfig.dbPort}/${enviromentVariablesConfig.database}`, mongooseConnectOptions);
	} else {
		mongoose.connect(`mongodb://${enviromentVariablesConfig.dbHost}:${enviromentVariablesConfig.dbPort}/${enviromentVariablesConfig.database}`, mongooseConnectOptions);
	}
}

const db = mongoose.connection;
db.on('error', (err) => {
	logger.error(`Connection error with database. ${err}`);
});

db.once('open', () => {
	if (enviromentVariablesConfig.enviroment !== ENVIRONMENT.DEVELOPMENT) {
		logger.info(`Connected with MongoDB service (${ENVIRONMENT.PRODUCTION} mode)`);
	} else {
		if (enviromentVariablesConfig.formatConnection === 'DNSseedlist' && enviromentVariablesConfig.mongoDNSseedlist !== '') {
			logger.info(`Connected with MongoDB service at "${enviromentVariablesConfig.mongoDNSseedlist}" using database "${enviromentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
		} else {
			logger.info(`Connected with MongoDB service at "${enviromentVariablesConfig.dbHost}" in port "${enviromentVariablesConfig.dbPort}" using database "${enviromentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
		}
	}


	logger.info('Trying to upsert the database with default values...');
	upsertDBWithExpenseCategories(expenseCategories);
	logger.info('The upsert of database has been finished.');

	initApplication();
});

const initApplication = async () => {
	const express = require('express');
	const favicon = require('serve-favicon');
	const path = require('path');
	const cors = require('cors');

	const { ApolloServer } = require('apollo-server-express');
	const { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } = require('apollo-server-core');

	const { setContext } = require('./gql/auth/setContext');
	const typeDefs = require('./gql/schemas/index');
	const resolvers = require('./gql/resolvers/index');

	const { getListOfIPV4Address } = require('./helpers/getListOfIPV4Address');
	const routesManager = require('./routes/routesManager');

	const app = express();
	app.use(cors({ credentials: true }));
	app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use('', routesManager);

	const server = new ApolloServer({ 
		typeDefs,
		resolvers,
		context: setContext,
		introspection: (enviromentVariablesConfig.enviroment === ENVIRONMENT.PRODUCTION) ? false : true, // Set to "true" only in development mode
		//playground: (enviromentVariablesConfig.enviroment === ENVIRONMENT.PRODUCTION) ? false : true, // Set to "true" only in development mode
		plugins: (enviromentVariablesConfig.enviroment === ENVIRONMENT.PRODUCTION) ? [ApolloServerPluginLandingPageDisabled()] : [requestDevLogger, ApolloServerPluginLandingPageGraphQLPlayground()], // Log all querys and their responses. Show playground (do not use in production)
	});

	await server.start();

	server.applyMiddleware({app});

	app.use((req, res) => {
		res.status(404).send('404'); // eslint-disable-line no-magic-numbers
	});

	app.listen(enviromentVariablesConfig.port, () => {
		getListOfIPV4Address().forEach(ip => {
			logger.info(`Application running on: http://${ip}:${enviromentVariablesConfig.port}`);
			if (enviromentVariablesConfig.enviroment !== ENVIRONMENT.PRODUCTION) {
				logger.info(`GraphQL Playground running on: http://${ip}:${enviromentVariablesConfig.port}${server.graphqlPath}`);
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
