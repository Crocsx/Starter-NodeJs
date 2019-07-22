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
var yaml = __importStar(require("js-yaml"));
var fs = __importStar(require("fs"));
var mongoose_1 = __importDefault(require("mongoose"));
var config;
try {
    config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
    mongoose_1.default.connect(config.mongodb.local.host + ":" + config.mongodb.local.port + "/" + config.mongodb.local.databaseName, { useNewUrlParser: true, useCreateIndex: true });
}
catch (e) {
    console.log(e);
}
