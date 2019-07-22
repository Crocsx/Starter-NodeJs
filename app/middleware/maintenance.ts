import express from 'express';

export /**
 * Server will refuse all connection for Maintenance mode 
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const maintenance = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(503).send("Server in maintenance mode");
}