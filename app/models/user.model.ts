import mongoose, { Schema, Document, Model } from 'mongoose';
import validator from 'validator';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface IUserToken extends Document {
    token: string;
}

export interface IUser extends Document {
    username: string;
    password : string;
    email : string;
    avatar: Buffer
    tokens : Array<IUserToken>
    generateAuthToken: () => string
}

interface IUserModel extends Model<IUser> {
    findByCredential(username: string, password: string): any; // this should be changed to the correct return type if possible.
}

const UserSchema: Schema = new Schema({
    username: { 
        type: String, 
        unique: true,
        required: true
    },
    password: { 
        type : String, 
        required : true,
        unique: true,
        trim: true,
        minlength : 8,
        validate(value: string) {     
            const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
            return re.test(value); 
        }
    },
    email: { 
        type : String, 
        required : true,
        trim: true,
        lowercase : true,
        validate(value: string) { return validator.isEmail(value)} 
    }, 
    avatar: { 
        type : Buffer, 
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true
});

// If user change password, we store an hashed version
UserSchema.pre('save', async function (next) {
    const user = this as IUser;
    if(user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next();
});

/**
 * Find a user by his credential
 *
 * @param {string} username
 * @param {string} password
 * @returns {IUser} user
 */
UserSchema.statics.findByCredential = async (username: string, password: string) => {
    const user = await User.findOne({ username });
    if(!user){ throw new Error('Unable to login'); }
    
    const isMatch = await bcryptjs.compare(password, user.password);
    if(!isMatch){ throw new Error('Unable to login'); }

    return user;
}

/**
 * Generate an auth token for the user
 *
 * @returns{string} auth token
 */
UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({
        _id : user._id.toString()
    }, process.env.JWT_SECRET!);
    user.tokens.push({token});
    await user.save();
    return token;
}

/**
 * Mongoose function in order to remove sensible
 * data when user request user informations
 *
 * @returns{string} auth token
 */
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);