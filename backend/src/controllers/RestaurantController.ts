import * as express from "express";
import Restaurant from "../models/Restaurant";
import User from "../models/User";
const router = express.Router();


export class RestaurantController {

    // Add a new restaurant
    addRestaurant = async (req: express.Request, res: express.Response) => {
        try {
            const newRestaurant = new Restaurant(req.body);
            await newRestaurant.save();
            res.json({msg: 'Success!'});
        } catch (error) {
            res.json({msg: error});
        }
    };
    
    // Get all restaurants
    getRestaurants = async (req: express.Request, res: express.Response) => {

        const restaurants = await Restaurant.find();
        return res.json(restaurants);

    };

    addWaiter = async (req: express.Request, res: express.Response) => {
        let newWaiter = req.body

        let username = newWaiter.username
        let password = newWaiter.password
        let forename = newWaiter.forename
        let surname = newWaiter.surname
        let sex = newWaiter.sex
        let type = "waiter"
        let address = newWaiter.address
        let email = newWaiter.email
        let contactPhone =newWaiter.contactPhone
        let securityQuestion = newWaiter.securityQuestion
        let securityAnswer = newWaiter.securityAnswer
        // let profilePicure = req.body.profilePicure
        let creditCardNumber = newWaiter.creditCardNumber
        let worksAt = newWaiter.worksAt

        let accountStatus = 1

        const restaurant = await Restaurant.findOne({ name:worksAt });

        if(!restaurant)
        {
            res.json({msg: "Restaurant not found!"})
            return
        }

        const existingUser = await User.findOne({ $or: [{ username:newWaiter.username }, { email:newWaiter.email }] })

      if (existingUser)
        return res.json({ msg: 'User already exists!' });

      const newUser = new User({
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
        accountStatus,
        worksAt,
      });

      await newUser.save();
      return res.json({ msg: 'Success!' });
    }
}
