const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Table Schema
const tableSchema = new Schema({
  id: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  radius: { type: Number, required: true },
  maxPeople: { type: Number, required: true }
});

// Kitchen Schema
const kitchenSchema = new Schema({
  id: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true }
});

// Toilet Schema
const toiletSchema = new Schema({
  id: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true }
});

// Layout Schema
const layoutSchema = new Schema({
  tables: [tableSchema],
  kitchens: [kitchenSchema],
  toilets: [toiletSchema]
});

// Working Hours Schema
const workingHoursSchema = new Schema({
  day: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true }
});

// Restaurant Schema
const restaurantSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  contactPerson: { type: String, required: true },
  layout: layoutSchema,
  workingHours: [workingHoursSchema],
  menu: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      imageLink: { type: String },
      ingredients: { type: String, required: true }
    }
  ]
});

export default mongoose.model("Restaurant", restaurantSchema, "Restaurants");