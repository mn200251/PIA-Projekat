import express from "express";
import { RestaurantController } from "../controllers/RestaurantController";

const restaurantRouter = express.Router();

restaurantRouter
    .route("/addRestaurant")
    .post((req, res) => new RestaurantController().addRestaurant(req, res));

restaurantRouter
    .route("/getRestaurants")
    .post((req, res) => new RestaurantController().getRestaurants(req, res));


export default restaurantRouter;