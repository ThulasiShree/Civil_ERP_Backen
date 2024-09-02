import mongoose from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";


export interface UsersDocument extends mongoose.Document {
  _id?: any;
  userId?:number;
  name?: String;
  mobileNumber?: Number;
  email?: String;
  address?:string;
  profilePicture?:string;
  following?:any;
  otp?:number;
  isDeleted?: Boolean;
  status?: Number;
  modifiedOn?: Date;
  modifiedBy?: String;
  createdOn?: Date;
  createdBy?: String;
}

const usersSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  userId:{type:Number},
  name: { type: String },
  email: { type: String },
  mobileNumber: { type: Number,required:true },
  otp:{type:Number},
  address: { type: String },
  following:[{ type: mongoose.Types.ObjectId, ref: 'Astrologer' }],
  profilePicture: { type: String,default:'https://s3.ap-south-1.amazonaws.com/pixalive.me/empty_profile.png' },
  fcm_Token: { type: String },
  notification:[{
    title:{ type: String },
    description:{ type: String }, 
    data:{ type: String }, 
    createdOn:{type:Date,default:Date.now}
}],
  isDeleted: { type: Boolean, default: false },
  status: { type: Number, default: 1 },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
  createdOn: { type: Date },
  createdBy: { type: String },
})

usersSchema.plugin(autoIncrement, {
  model: 'Users',
  field: 'userId',
  startAt: 1,
  incrementBy: 1
});


export const Users = mongoose.model("Users", usersSchema);
