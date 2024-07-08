"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const restaurantRouter_1 = __importDefault(require("./routers/restaurantRouter"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/images", express_1.default.static(path_1.default.join('src', 'images')));
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join("src", "images"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const fileChecker = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(new Error("Wrong image format"));
    }
};
const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000, width: 300, height: 300 },
}).fields([
    { name: "profilePicture", maxCount: 1 },
]);
app.use(upload);
mongoose_1.default.connect("mongodb://127.0.0.1:27017/PIAProjekat");
const connection = mongoose_1.default.connection;
connection.once("open", () => {
    console.log("db connection ok");
});
const router = express_1.default.Router();
router.use("/users", userRouter_1.default);
router.use("/restaurants", restaurantRouter_1.default);
app.use("/", router);
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));
