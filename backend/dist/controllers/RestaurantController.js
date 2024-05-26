"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const express = __importStar(require("express"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const User_1 = __importDefault(require("../models/User"));
const router = express.Router();
class RestaurantController {
    constructor() {
        // Add a new restaurant
        this.addRestaurant = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newRestaurant = new Restaurant_1.default(req.body);
                yield newRestaurant.save();
                res.json({ msg: 'Success!' });
            }
            catch (error) {
                res.json({ msg: error });
            }
        });
        // Get all restaurants
        this.getRestaurants = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const restaurants = yield Restaurant_1.default.find();
            return res.json(restaurants);
        });
        this.addWaiter = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let newWaiter = req.body;
            let username = newWaiter.username;
            let password = newWaiter.password;
            let forename = newWaiter.forename;
            let surname = newWaiter.surname;
            let sex = newWaiter.sex;
            let type = "waiter";
            let address = newWaiter.address;
            let email = newWaiter.email;
            let contactPhone = newWaiter.contactPhone;
            let securityQuestion = newWaiter.securityQuestion;
            let securityAnswer = newWaiter.securityAnswer;
            // let profilePicure = req.body.profilePicure
            let creditCardNumber = newWaiter.creditCardNumber;
            let worksAt = newWaiter.worksAt;
            let accountStatus = 1;
            const restaurant = yield Restaurant_1.default.findOne({ name: worksAt });
            if (!restaurant) {
                res.json({ msg: "Restaurant not found!" });
                return;
            }
            const existingUser = yield User_1.default.findOne({ $or: [{ username: newWaiter.username }, { email: newWaiter.email }] });
            if (existingUser)
                return res.json({ msg: 'User already exists!' });
            const newUser = new User_1.default({
                username,
                password,
                forename,
                surname,
                sex,
                type,
                address,
                email,
                contactPhone,
                securityQuestion,
                securityAnswer,
                creditCardNumber,
                accountStatus,
                worksAt,
            });
            yield newUser.save();
            return res.json({ msg: 'Success!' });
        });
    }
}
exports.RestaurantController = RestaurantController;
