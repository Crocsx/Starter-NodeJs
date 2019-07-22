"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var validator_1 = __importDefault(require("validator"));
var UserSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        lowercase: true,
        validate: function (value) {
            var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
            return re.test(value);
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: function (value) { return validator_1.default.isEmail(value); }
    }
});
// Export the model and return your IUser interface
exports.User = mongoose_1.default.model('User', UserSchema);
