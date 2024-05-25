"use strict";
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
class UserController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            User_1.default.findOne({ username: username, password: password })
                .then((user) => {
                res.json(user);
            })
                .catch((err) => console.log(err));
        };
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
            // let profilePicure = req.body.profilePicure
            let creditCardNumber = req.body.creditCardNumber;
            let accountStatus = 0;
            const existingUser = yield User_1.default.findOne({ $or: [{ username: username }, { email: email }] });
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
                accountStatus
            });
            yield newUser.save();
            return res.json({ msg: 'Sent registration request successfully!' });
        });
        this.updateInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, forename, surname, address, email, contactPhone, creditCardNumber } = req.body;
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
                return res.json({ msg: 'User unbanned successfully!' });
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
            if (user.password != oldPassword) {
                return res.json({ msg: 'Incorrect password for user!' });
            }
            user.password = newPassword;
            yield user.save();
            return res.json({ msg: 'Success!' });
        });
    }
}
exports.UserController = UserController;
