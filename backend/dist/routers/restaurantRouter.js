"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RestaurantController_1 = require("../controllers/RestaurantController");
const restaurantRouter = express_1.default.Router();
restaurantRouter
    .route("/addRestaurant")
    .post((req, res) => new RestaurantController_1.RestaurantController().addRestaurant(req, res));
restaurantRouter
    .route("/getRestaurants")
    .get((req, res) => new RestaurantController_1.RestaurantController().getRestaurants(req, res));
restaurantRouter
    .route("/addWaiter")
    .post((req, res) => new RestaurantController_1.RestaurantController().addWaiter(req, res));
restaurantRouter
    .route("/addReservation")
    .post((req, res) => new RestaurantController_1.RestaurantController().addReservation(req, res));
restaurantRouter
    .route("/getReservations")
    .get((req, res) => new RestaurantController_1.RestaurantController().getReservations(req, res));
restaurantRouter
    .route("/getAvailableTables")
    .post((req, res) => new RestaurantController_1.RestaurantController().getAvailableTables(req, res));
restaurantRouter
    .route("/confirmReservation")
    .post((req, res) => new RestaurantController_1.RestaurantController().confirmReservation(req, res));
restaurantRouter
    .route("/rejectReservation")
    .post((req, res) => new RestaurantController_1.RestaurantController().rejectReservation(req, res));
restaurantRouter
    .route("/showedUp")
    .post((req, res) => new RestaurantController_1.RestaurantController().showedUp(req, res));
exports.default = restaurantRouter;
