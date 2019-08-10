
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../../app/models/user.model'

export const testUserId1 = new mongoose.Types.ObjectId();
export const testUser1 = {
    _id : testUserId1,
    username: "Mike_1",
    password : "Mike_1111",
    email : "mike1@gmail.com",
    tokens : [{
        token : jwt.sign({ "_id" : testUserId1}, process.env.JWT_SECRET! )
    }]
}

export const testUserId2 = new mongoose.Types.ObjectId();
export const testUser2 = {
    _id : testUserId2,
    username: "Mike_2",
    password : "Mike_22222",
    email : "mike2@d3gmail.com",
    tokens : [{
        token : jwt.sign({ "_id" : testUserId2}, process.env.JWT_SECRET! )
    }]
}

export const setup = async () => {
    await User.deleteMany({});
    await User.create(testUser1);
    await User.create(testUser2);
}