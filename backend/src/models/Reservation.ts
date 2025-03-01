import mongoose, { Schema } from 'mongoose';


export const ReservationSchema: Schema = new Schema({
    username: { type: String, required: true },
    restaurantName: { type: String, required: true },
    tableId: { type: Number, default: null},
    confirmedByWaiter: { type: String, default: ""},
    // cancelledByUser: { type: Boolean, default: false},
    cancelledByWaiter: { type: Boolean, default: false},

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true },
    additionalRequests: { type: String, required: false },
    showedUp: { type: Number, default: 0 },
    
});

export default mongoose.model("Reservation", ReservationSchema, "Reservations");