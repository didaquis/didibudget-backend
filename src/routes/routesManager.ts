import { Router, Request, Response } from 'express';

const routesManager: Router = Router();

/**
 * Example of route
 */
routesManager.get('/', (req: Request, res: Response) => {
	const status = 200;
	res.status(status).end();
});

export default routesManager;
