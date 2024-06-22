import mongoose, { Schema } from 'mongoose';


export const ReservationSchema: Schema = new Schema({
    username: { type: String, required: true },
    restaurantName: { type: String, required: true },
    tableId: { type: Number, required: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true },
    additionalRequests: { type: String, required: false },

});

export default mongoose.model("Reservation", ReservationSchema, "Reservations");