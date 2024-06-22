import * as express from "express";
import Restaurant from "../models/Restaurant";
import User from "../models/User";
import Reservation from "../models/Reservation";
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

    addReservation = async (req: express.Request, res: express.Response) => {
        try {
            // Extract the date and time from req.body
            const { date, time } = req.body;

            // Calculate 3 hours after the extracted time
            const startTime = new Date(`${date} ${time}`);
            const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
    
            const restaurantName = req.body.restaurantName;

            // Find the restaurant
            
            const restaurant = await Restaurant.findOne({ name:restaurantName });
            if (!restaurant) {
                return res.json({ msg: 'Restaurant not found' });
            }

            // Find all tables in the restaurant
            let tables: any[] = Array.from(restaurant.layout.tables);
    
            // Check if any table is available during the specified time
            let isTableAvailable = false;
            let tableId = null;

            for (const table of tables as any[]) {
                const existingReservations = await Reservation.find({
                    restaurantName: restaurantName,
                    tableId: table.id,
                    $or: [
                        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                        { startTime: { $lt: startTime }, endTime: { $gt: startTime } },
                        { startTime: { $lt: endTime }, endTime: { $gt: endTime } }
                    ]
                });
    
                if (existingReservations.length == 0) {
                    isTableAvailable = true;
                    tableId = table.id;
                    break;
                }
            }
    
            if (!isTableAvailable) {
                return res.json({ msg: 'No available tables during the specified time' });
            }
    
            // Create a new reservation
            const newReservation = new Reservation(req.body);
            newReservation.tableId = tableId;

            await newReservation.save();
            return res.json({ msg: 'Success!' });

        } catch (error) {
            return res.json({ msg: (error as Error).message });
        }
    }
}
