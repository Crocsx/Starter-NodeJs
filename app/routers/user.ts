import * as Models from '../models/index';
import * as MiddleWare from '../MiddleWare/index';
import express, { Router } from 'express';

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
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(e) {
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
 * Return the user profile
 * @type {GET}
 * @returns {IUser} user
 */
UserRouter.get('/user/me', MiddleWare.verifyToken, async (req, res) => {
    res.send(res.locals.user);
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
        res.locals.user.remove();
        res.send(res.locals.user);
    } catch(e) {
        res.status(500).send(e);
    }
})