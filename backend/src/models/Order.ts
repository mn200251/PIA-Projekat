import mongoose, { Schema } from 'mongoose';


export const OrderSchema: Schema = new Schema({
    id: {type: Number},
    username: {type: String},
    restaurantName: {type: String},
    status: {type: String},
    estimatedTime: {type: String},
    items: [
        {
            name: {type: String},
            price: {type: Number},
            quantity: {type: Number}
        }
    
    ],
    totalPrice: {type: Number},
    orderTime: {type: Date }
});

export default mongoose.model("Order", OrderSchema, "Orders");