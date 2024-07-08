"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let User = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    forename: {
        type: String,
    },
    surname: {
        type: String,
    },
    sex: {
        type: String,
    },
    type: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
    },
    contactPhone: {
        type: Number,
    },
    securityQuestion: {
        type: String,
    },
    securityAnswer: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    creditCardNumber: {
        type: Number,
    },
    accountStatus: {
        type: Number,
    },
    worksAt: {
        type: String,
    },
});
exports.default = mongoose_1.default.model("User", User, "Users");
