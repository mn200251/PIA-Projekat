import express from "express";
import { RestaurantController } from "../controllers/RestaurantController";

const restaurantRouter = express.Router();

restaurantRouter
    .route("/addRestaurant")
    .post((req, res) => new RestaurantController().addRestaurant(req, res));

restaurantRouter
    .route("/getRestaurants")
    .get((req, res) => new RestaurantController().getRestaurants(req, res));

restaurantRouter
    .route("/addWaiter")
    .post((req, res) => new RestaurantController().addWaiter(req, res));

restaurantRouter
    .route("/addReservation")
    .post((req, res) => new RestaurantController().addReservation(req, res));

restaurantRouter
    .route("/getReservations")
    .get((req, res) => new RestaurantController().getReservations(req, res));

restaurantRouter
    .route("/getAvailableTables")
    .post((req, res) => new RestaurantController().getAvailableTables(req, res));

restaurantRouter
    .route("/confirmReservation")
    .post((req, res) => new RestaurantController().confirmReservation(req, res));

restaurantRouter
    .route("/rejectReservation")
    .post((req, res) => new RestaurantController().rejectReservation(req, res));

restaurantRouter
    .route("/showedUp")
    .post((req, res) => new RestaurantController().showedUp(req, res));

restaurantRouter
    .route("/addMenuItem")
    .post((req, res) => new RestaurantController().addMenuItem(req, res));

restaurantRouter
    .route("/getOrders")
    .get((req, res) => new RestaurantController().getOrders(req, res));

restaurantRouter
    .route("/addOrder")
    .post((req, res) => new RestaurantController().addOrder(req, res));

restaurantRouter
    .route("/updateDelivery")
    .post((req, res) => new RestaurantController().updateDelivery(req, res));

export default restaurantRouter;