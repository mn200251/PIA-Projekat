import * as express from "express";
import Restaurant from "../models/Restaurant";
const router = express.Router();


export class RestaurantController {

    // Add a new restaurant
    addRestaurant = async (req: express.Request, res: express.Response) => {
        try {
            const newRestaurant = new Restaurant(req.body);
            await newRestaurant.save();
            res.json({msg: 'Success!'});
        } catch (error) {
            res.send(error);
        }
    };
    
    // Get all restaurants
    getRestaurants = async (req: express.Request, res: express.Response) => {

        const restaurants = await Restaurant.find();
        return res.json(restaurants);

    };
}
