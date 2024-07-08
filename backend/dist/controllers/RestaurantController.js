"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const express = __importStar(require("express"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const User_1 = __importDefault(require("../models/User"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Order_1 = __importDefault(require("../models/Order"));
const crypto = __importStar(require("crypto"));
const router = express.Router();
class RestaurantController {
    constructor() {
        // Add a new restaurant
        this.addRestaurant = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newRestaurant = new Restaurant_1.default(req.body);
                yield newRestaurant.save();
                res.json({ msg: 'Success!' });
            }
            catch (error) {
                res.json({ msg: error });
            }
        });
        // Get all restaurants
        this.getRestaurants = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const restaurants = yield Restaurant_1.default.find();
            return res.json(restaurants);
        });
        this.addWaiter = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let newWaiter = req.body;
            let username = newWaiter.username;
            let password = newWaiter.password;
            let forename = newWaiter.forename;
            let surname = newWaiter.surname;
            let sex = newWaiter.sex;
            let type = "waiter";
            let address = newWaiter.address;
            let email = newWaiter.email;
            let contactPhone = newWaiter.contactPhone;
            let securityQuestion = newWaiter.securityQuestion;
            let securityAnswer = newWaiter.securityAnswer;
            // let profilePicure = req.body.profilePicure
            let creditCardNumber = newWaiter.creditCardNumber;
            let worksAt = newWaiter.worksAt;
            let accountStatus = 1;
            const restaurant = yield Restaurant_1.default.findOne({ name: worksAt });
            if (!restaurant) {
                res.json({ msg: "Restaurant not found!" });
                return;
            }
            const existingUser = yield User_1.default.findOne({ $or: [{ username: newWaiter.username }, { email: newWaiter.email }] });
            if (existingUser)
                return res.json({ msg: 'User already exists!' });
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            const newUser = new User_1.default({
                username,
                hashedPassword,
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
            yield newUser.save();
            return res.json({ msg: 'Success!' });
        });
        this.addReservation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the date and time from req.body
                const { date, time } = req.body;
                // Calculate 3 hours after the extracted time
                const startTime = new Date(`${date} ${time}`);
                const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
                const restaurantName = req.body.restaurantName;
                // Find the restaurant
                const restaurant = yield Restaurant_1.default.findOne({ name: restaurantName });
                if (!restaurant) {
                    return res.json({ msg: 'Restaurant not found' });
                }
                // Find all tables in the restaurant
                let tables = Array.from(restaurant.layout.tables);
                // Check if any table is available during the specified time
                let isTableAvailable = false;
                let tableId = null;
                /*
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
                */
                // Create a new reservation
                const newReservation = new Reservation_1.default(req.body);
                // newReservation.tableId = tableId;
                yield newReservation.save();
                return res.json({ msg: 'Success!' });
            }
            catch (error) {
                return res.json({ msg: error.message });
            }
        });
        this.getReservations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const reservations = yield Reservation_1.default.find();
            return res.json(reservations);
        });
        this.getAvailableTables = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const restaurantName = req.body.restaurantName;
            const numberOfPeople = req.body.numberOfPeople;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;
            const restaurant = yield Restaurant_1.default.findOne({ name: restaurantName });
            if (!restaurant) {
                return res.json({ msg: 'Restaurant not found!' });
            }
            let tables = Array.from(restaurant.layout.tables);
            let availableTables = [];
            for (const table of tables) {
                const existingReservations = yield Reservation_1.default.find({
                    restaurantName: restaurantName,
                    tableId: table.id,
                    $or: [
                        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                        { startTime: { $lt: startTime }, endTime: { $gt: startTime } },
                        { startTime: { $lt: endTime }, endTime: { $gt: endTime } }
                    ]
                });
                if (existingReservations.length == 0) {
                    availableTables.push(table.id);
                }
            }
            return res.json(availableTables);
        });
        this.confirmReservation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const reservation = yield Reservation_1.default.findOne({ username: req.body.username, restaurantName: req.body.restaurantName,
                startTime: req.body.startTime, endTime: req.body.endTime,
                numberOfPeople: req.body.numberOfPeople,
                additionalRequests: req.body.additionalRequests
            });
            if (!reservation) {
                return res.json({ msg: 'Reservation not found!' });
            }
            // check if the reservation is already accepted
            if (reservation.confirmedByWaiter) {
                return res.json({ msg: 'Reservation is already accepted!' });
            }
            // check if table is still available
            const targetTable = req.body.tableId;
            const restaurantName = reservation.restaurantName;
            const startTime = reservation.startTime;
            const endTime = reservation.endTime;
            console.log(targetTable);
            const existingReservations = yield Reservation_1.default.find({
                restaurantName: restaurantName,
                tableId: targetTable,
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                    { startTime: { $lt: startTime }, endTime: { $gt: startTime } },
                    { startTime: { $lt: endTime }, endTime: { $gt: endTime } }
                ],
                confirmedByWaiter: { $ne: "" }
            });
            if (existingReservations.length > 0) {
                return res.json({ msg: 'Table is not available anymore!' });
            }
            //
            reservation.confirmedByWaiter = req.body.confirmedByWaiter;
            reservation.tableId = targetTable;
            yield reservation.save();
            return res.json({ msg: 'Success!' });
        });
        this.rejectReservation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const reservation = yield Reservation_1.default.findOne({ username: req.body.username, restaurantName: req.body.restaurantName,
                startTime: req.body.startTime, endTime: req.body.endTime,
                numberOfPeople: req.body.numberOfPeople,
                additionalRequests: req.body.additionalRequests
            });
            if (!reservation) {
                return res.json({ msg: 'Reservation not found!' });
            }
            // check if the reservation is already rejected
            if (reservation.cancelledByWaiter) {
                return res.json({ msg: 'Reservation is already rejected!' });
            }
            reservation.cancelledByWaiter = true;
            yield reservation.save();
            return res.json({ msg: 'Success!' });
        });
        this.showedUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const reservation = yield Reservation_1.default.findOne({ username: req.body.username, restaurantName: req.body.restaurantName,
                startTime: req.body.startTime, endTime: req.body.endTime,
                numberOfPeople: req.body.numberOfPeople,
                additionalRequests: req.body.additionalRequests
            });
            if (!reservation) {
                return res.json({ msg: 'Reservation not found!' });
            }
            // check if the reservation is already accepted
            if (reservation.showedUp == 1) {
                return res.json({ msg: 'Guests already confirmed to have shown up!' });
            }
            if (reservation.showedUp == -1) {
                return res.json({ msg: 'Guests already confirmed not to have shown up!' });
            }
            reservation.showedUp = req.body.showedUp;
            yield reservation.save();
            return res.json({ msg: 'Success!' });
        });
        this.addMenuItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const restaurantName = req.body.restaurantName;
            const menuItem = req.body.menuItem;
            const restaurant = yield Restaurant_1.default.findOne({ name: restaurantName });
            if (!restaurant) {
                return res.json({ msg: 'Restaurant not found!' });
            }
            restaurant.menu.push(menuItem);
            yield restaurant.save();
            return res.json({ msg: 'Success!' });
        });
        this.getOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const orders = yield Order_1.default.find();
            return res.json(orders);
        });
        this.addOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let restaurantName = req.body.restaurantName;
            let status = req.body.status;
            let items = req.body.items;
            let totalPrice = req.body.totalPrice;
            let orderTime = req.body.orderTime;
            const lastOrder = yield Order_1.default.findOne().sort({ id: -1 }).limit(1);
            const newOrderId = lastOrder ? lastOrder.id + 1 : 1;
            const newOrder = new Order_1.default({ id: newOrderId,
                username,
                restaurantName,
                status,
                items,
                estimatedTime: "",
                totalPrice,
                orderTime
            });
            yield newOrder.save();
            return res.json({ msg: 'Success!' });
        });
        this.updateDelivery = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.body.id;
            const estimatedTime = req.body.estimatedTime;
            const status = req.body.status;
            const order = yield Order_1.default.findOne({ id: id });
            if (!order) {
                return res.json({ msg: 'Order not found!' });
            }
            order.estimatedTime = estimatedTime;
            order.status = status;
            yield order.save();
            return res.json({ msg: 'Success!' });
        });
    }
}
exports.RestaurantController = RestaurantController;
