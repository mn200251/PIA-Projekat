import express from "express";
import { UserController } from "../controllers/UserController";

const userRouter = express.Router();


userRouter
  .route("/login")
  .post((req, res) => new UserController().login(req, res));

userRouter
  .route("/register")
  .post((req, res) => new UserController().register(req, res));

userRouter
  .route("/updateInfo")
  .post((req, res) => new UserController().updateInfo(req, res));

userRouter
    .route("/getUsers")
    .get((req, res) => new UserController().getUsers(req, res));

export default userRouter;