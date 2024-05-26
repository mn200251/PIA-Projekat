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


export default restaurantRouter;