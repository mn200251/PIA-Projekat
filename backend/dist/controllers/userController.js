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
exports.UserController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const crypto = __importStar(require("crypto"));
// const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
class UserController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let password = req.body.password;
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            const user = yield User_1.default.findOne({ username: username, password: hashedPassword });
            if (!user) {
                // return res.json({ msg: 'Incorrect username or password!' });
                return;
            }
            // const profilePicture = await fs.readFileSync(user.profilePicture, 'base64')
            // user.profilePicture = profilePicture;
            return res.json(user);
        });
        this.uploadPicture = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const profFile = req.files;
            if (typeof profFile === "object" &&
                profFile !== null &&
                "profilePicture" in profFile) {
                const picFileName = profFile.profilePicture[0].filename;
                const profilePicPath = "http://localhost:4000/images/" + picFileName;
                res.json(profilePicPath);
            }
            else {
                console.log(profFile);
            }
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let password = req.body.password;
            let forename = req.body.forename;
            let surname = req.body.surname;
            let sex = req.body.sex;
            let type = req.body.type;
            let address = req.body.address;
            let email = req.body.email;
            let contactPhone = req.body.contactPhone;
            let securityQuestion = req.body.securityQuestion;
            let securityAnswer = req.body.securityAnswer;
            let profilePicture = req.body.profilePicture; //////////////////////////////
            let creditCardNumber = req.body.creditCardNumber;
            let accountStatus = 0;
            const existingUser = yield User_1.default.findOne({ $or: [{ username: username }, { email: email }] });
            if (existingUser)
                return res.json({ msg: 'User already exists!' });
            // add image or set default image
            if (profilePicture == "" || profilePicture == null || profilePicture == undefined) {
                profilePicture = "http://localhost:4000/images/default.jpg";
            }
            else {
                // console.log("alo");
                // const profilePicturesDir = path.join('src', 'images', 'profilePictures', username);
                // if (!fs.existsSync(profilePicturesDir)) {
                //     fs.mkdirSync(profilePicturesDir);
                // }
                // const profilePicurePath = path.join('src', 'images', 'profilePictures', username, username + '.jpg');
                /*
                const base64Data = profilePicture.replace(/^data:image\/\w+;base64,/, '');
                const bufferData = Buffer.from(base64Data, 'base64');
                fs.writeFileSync(profilePicurePath, bufferData);
                */
                // profilePicture = profilePicurePath;
                console.log(profilePicture);
            }
            // Encrypt the password
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            const newUser = new User_1.default({
                username,
                password: hashedPassword,
                forename,
                surname,
                sex,
                type,
                address,
                email,
                contactPhone,
                securityQuestion,
                securityAnswer,
                profilePicture,
                creditCardNumber,
                accountStatus,
            });
            yield newUser.save();
            return res.json({ msg: 'Success!' });
        });
        this.updateInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, forename, surname, address, email, contactPhone, profilePicture, creditCardNumber } = req.body;
                const user = yield User_1.default.findOne({ username });
                if (!user) {
                    return res.json({ msg: 'User not found' });
                }
                // check if new email is already used by another user
                const user2 = yield User_1.default.findOne({ email });
                if (user2) {
                    if (user2.email != user.email) {
                        return res.json({ msg: 'New email is already taken!' });
                    }
                }
                // Update user information
                user.forename = forename;
                user.surname = surname;
                user.address = address;
                user.email = email;
                user.contactPhone = contactPhone;
                user.creditCardNumber = creditCardNumber;
                user.profilePicture = profilePicture;
                // Save the updated user information
                yield user.save();
                res.json({ msg: 'User information updated successfully!' });
            }
            catch (error) {
                res.json({ msg: 'An error occurred while updating user information!' });
            }
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.default.find({ type: { $ne: "admin" } });
            return res.json(users);
        });
        this.setStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let newStatusValue = req.body.accountStatus;
            const user = yield User_1.default.findOne({ username });
            if (!user) {
                return res.json({ msg: 'User not found' });
            }
            user.accountStatus = newStatusValue;
            yield user.save();
            if (newStatusValue == -2)
                return res.json({ msg: 'User banned successfully!' });
            else if (newStatusValue == 1)
                return res.json({ msg: 'User is now active!' });
            else if (newStatusValue == -1)
                return res.json({ msg: 'User rejected successfully!' });
        });
        this.resetPasswordKnow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let oldPassword = req.body.oldPassword;
            let newPassword = req.body.newPassword;
            const user = yield User_1.default.findOne({ username });
            if (!user) {
                return res.json({ msg: 'User not found!' });
            }
            const oldHashedPassword = crypto.createHash('sha256').update(oldPassword).digest('hex');
            const newHashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
            if (oldHashedPassword == newHashedPassword) {
                return res.json({ msg: "New password can not be same as old password!" });
            }
            if (user.password != oldHashedPassword) {
                return res.json({ msg: 'Incorrect password for user!' });
            }
            user.password = newHashedPassword;
            yield user.save();
            return res.json({ msg: 'Success!' });
        });
        this.getSecurityDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            const user = yield User_1.default.findOne({ username });
            if (!user) {
                return res.json({ msg: 'User not found!' });
            }
            return res.json(user);
        });
        this.resetPasswordDontKnow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let newPassword = req.body.newPassword;
            const newHashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
            const user = yield User_1.default.findOne({ username });
            if (!user) // should never happen!
             {
                return res.json({ msg: 'User not found!' });
            }
            user.password = newHashedPassword;
            yield user.save();
            return res.json({ msg: 'Success!' });
        });
        this.getReservations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            const reservations = yield Reservation_1.default.find({ username });
            return res.json(reservations);
        });
        this.cancelReservation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let reservationID = req.body._id;
            const reservation = yield Reservation_1.default.findOne({ _id: reservationID });
            if (!reservation) {
                return res.json({ msg: 'Reservation not found!' });
            }
            if (reservation.cancelledByUser == true) {
                return res.json({ msg: 'Reservation already cancelled!' });
            }
            reservation.cancelledByUser = true;
            yield reservation.save();
            return res.json({ msg: 'Success!' });
        });
    }
}
exports.UserController = UserController;
