"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const userRouter = express_1.default.Router();
userRouter
    .route("/login")
    .post((req, res) => new UserController_1.UserController().login(req, res));
userRouter
    .route("/register")
    .post((req, res) => new UserController_1.UserController().register(req, res));
userRouter
    .route("/updateInfo")
    .post((req, res) => new UserController_1.UserController().updateInfo(req, res));
userRouter
    .route("/getUsers")
    .get((req, res) => new UserController_1.UserController().getUsers(req, res));
userRouter
    .route("/setBan")
    .post((req, res) => new UserController_1.UserController().setBan(req, res));
exports.default = userRouter;
