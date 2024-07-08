import express, { Request } from 'express';
import { Multer } from 'multer';
import { FileFilterCallback } from "multer";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from './routers/userRouter';
import restaurantRouter from './routers/restaurantRouter';
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());


app.use("/images", express.static(path.join('src', 'images')));

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, path.join("src", "images"));
  },
  filename: function (req: Request, file: any, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileChecker = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Wrong image format"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 , width: 300, height: 300},
}).fields([
  { name: "profilePicture", maxCount: 1 },
]);

app.use(upload);


mongoose.connect("mongodb://127.0.0.1:27017/PIAProjekat");

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

const router = express.Router();
router.use("/users", userRouter);
router.use("/restaurants", restaurantRouter);

app.use("/", router);

app.get('/', (req, res) => res.send('Hello World!'));








app.listen(4000, () => console.log(`Express server running on port 4000`));