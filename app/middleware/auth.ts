import express from 'express';
import { User } from '../models/index';
import * as jwt from 'jsonwebtoken';
 
export /**
 * Check if auth token is valid
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const verifyToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.header('Authorization')!.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await User.findOne({_id : decoded._id, 'tokens.token' : token});
        if(!user) { throw new Error(); }
        res.locals = {
            user,
            token
        };
        next();
    } catch(e) {
        res.status(401).send(e);
    }
}