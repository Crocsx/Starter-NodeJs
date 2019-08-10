import multer from 'multer';
import express, { Router } from 'express';
import * as Models from '../models/index';
import * as MiddleWare from '../middleware/index';
import * as sendGrid from '../emails/account';
import sharp from 'sharp';
import { IUser } from '../models/index';

export const UserRouter = express.Router() as Router;

/**
 * Sign up a new user
 * @type {POST}
 * @param {IUser} user : user information
 * @returns {string} token : string
 * @returns {string} token : string
 */
UserRouter.post('/user/signup', async (req, res) => {
    const user = new Models.User(req.body);
    try {
        await user.save();
        sendGrid.sendWelcomeEmail(user.email, user.username);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(e) {
        console.log(e)
        res.status(400).send(e);
    }
})

/**
 * Loggin an user
 * @type {POST}
 * @param {string} username : username
 * @param {string} password : password
 * @returns {string} token : string
 * @returns {IUser} token : user auth token
 */
UserRouter.post('/user/login', async (req, res) => {
    try {
        const user = await Models.User.findByCredential(req.body.username, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    } catch(e) {
        res.status(400).send(e)
    }
})

/**
 * Logout an user
 * @type {POST}
 * @param {string} username : username
 * @param {string} password : password
 * @returns {string} token : string
 * @returns {IUser} token : user auth token
 */
UserRouter.post('/user/logout', MiddleWare.verifyToken, async (req, res) => {
    try {
        res.locals.user.tokens = res.locals.user.tokens.filter((token: Models.IUserToken) => token.token !== res.locals.token)
        await res.locals.user.save();
        res.status(200).send();
    } catch(e) {
        res.status(500).send(e)
    }
})

/**
 * Logout an user
 * @type {POST}
 * @param {string} username : username
 * @param {string} password : password
 * @returns {string} token : string
 * @returns {IUser} token : user auth token
 */
UserRouter.post('/user/logoutAll', MiddleWare.verifyToken, async (req, res) => {
    try {
        res.locals.user.tokens = new Array<Models.IUserToken>();
        await res.locals.user.save();
        res.status(200).send();
    } catch(e) {
        res.status(500).send(e)
    }
})

/**
 * Upload an user avatar
 * @param {string} avatar : image (jpg/png)
 * @type {POST}
 */
const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            cb(new Error('Unsupported format'), false);
        }
        cb(null, true);
    }
}).single('avatar');

UserRouter.post('/user/me/avatar', MiddleWare.verifyToken, avatar, async (req: any, res: any) => {
    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer();
    res.locals.user.avatar = buffer;
    await res.locals.user.save();
    res.status(200).send();
}, (error: any, req :any, res :any, next: any) => {
    res.status(400).send({error : error.message});
})

/**
 * Delete an user avatar
 * @type {DELETE}
 */
UserRouter.delete('/user/me/avatar', MiddleWare.verifyToken, async (req: any, res: any) => {
    res.locals.user.avatar = undefined;
    await res.locals.user.save();
    res.status(200).send();
}, (error: any, req :any, res :any, next: any) => {
    res.status(400).send({error : error.message});
})

/**
 * Get an user avatar
 * @type {GET}
 */
UserRouter.get('/user/:_id/avatar', async (req: any, res: any) => {
    try {
        const user = await Models.User.findById(req.params._id);
        if (!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png');
        res.status(200).send(user.avatar)
    } catch(e){
        res.status(404).send();
    }
})

/**
 * Return the user profile
 * @type {GET}
 * @returns {IUser} user
 */
UserRouter.get('/user/me', MiddleWare.verifyToken, async (req, res) => {
    res.send(res.locals.user);
})

/**
 * Update an user
 * @type {PATCH}
 * @param {IUser} user : user new information
 * @returns {IUser} user : user updated
 */
UserRouter.patch('/user/me', MiddleWare.verifyToken, async (req, res) => {
    try {
        Object.assign(res.locals.user, req.body as Models.IUser);
        await res.locals.user.save();
        res.send({user: res.locals.user});
    } catch(e) {
        res.status(400).send(e);
    }
})

/**
 * Delete an user by _id
 * @type {DELETE}
 * @param {IUser} user : user new information
 * @returns {IUser} user : user updated
 */
UserRouter.delete('/user/me', MiddleWare.verifyToken, async (req, res) => {
    try {
        console.log(res.locals.user)
        res.locals.user.remove();
        sendGrid.sendByeEmail(res.locals.user.email, res.locals.user.username);
        res.send();
    } catch(e) {
        res.status(500).send(e);
    }
})

/**
 * Return a specific user by _id.
 * @type {GET}
 * @returns {IUser} user
 */
UserRouter.get('/user/:_id', MiddleWare.verifyToken, async (req, res) => {
    try {
        const user = await Models.User.find({_id: req.params._id})
        if(!user) { return res.status(404).send(user); }

        res.send(user);
    } catch(e) {
        res.status(400).send(e);
    }
})