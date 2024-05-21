import mongoose from "mongoose";

const Schema = mongoose.Schema;

let User = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  forename: {
    type: String,
  },
  surname: {
    type: String,
  },
  sex: {
    type: String,
  },
  type: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  contactPhone: {
    type: Number,
  },
  securityQuestion: {
    type: String,
  },
  securityAnswer: {
    type: String,
  },
  // profilePicure: {
  //   type: any,
  // },
  creditCardNumber: {
    type: Number,
  },
  accountStatus: {
    type: Number,
  }
});

export default mongoose.model("User", User, "Users");