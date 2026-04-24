import dotenv from 'dotenv';
dotenv.config();

import { ENVIRONMENT } from './environment.js';

const serverPortByDefault = 4000;
const limitOfUsersRegistered = 0; /* Set the value to 0 to not use the limit. Remember put the same value on the environment variables */

export interface EnvironmentVariablesConfig {
	formatConnection: string;
	mongoDNSseedlist: string;
	dbHost: string;
	dbPort: string;
	database: string;
	mongoUser: string;
	mongoPass: string;
	environment: string;
	port: number;
}

export const environmentVariablesConfig = Object.freeze<EnvironmentVariablesConfig>({
	formatConnection: process.env.MONGO_FORMAT_CONNECTION || 'standard',
	mongoDNSseedlist: process.env.MONGO_DNS_SEEDLIST_CONNECTION || '',
	dbHost: process.env.MONGO_HOST || '127.0.0.1',
	dbPort: process.env.MONGO_PORT || '27017',
	database: process.env.MONGO_DB || 'didibudget_database',
	mongoUser: process.env.MONGO_USER || '',
	mongoPass: process.env.MONGO_PASS || '',
	environment: (process.env.ENVIRONMENT === ENVIRONMENT.DEVELOPMENT) ? ENVIRONMENT.DEVELOPMENT : ENVIRONMENT.PRODUCTION,
	port: Number(process.env.PORT) || serverPortByDefault
});

export interface SecurityVariablesConfig {
	secret: string;
	timeExpiration: string;
}

export const securityVariablesConfig = Object.freeze<SecurityVariablesConfig>({
	secret: process.env.SECRET || 'yoursecret',
	timeExpiration: process.env.DURATION || '2h'
});

export interface GlobalVariablesConfig {
	limitOfUsersRegistered: number;
}

export const globalVariablesConfig = Object.freeze<GlobalVariablesConfig>({
	limitOfUsersRegistered: Number(process.env.LIMIT_USERS_REGISTERED) || limitOfUsersRegistered
});
