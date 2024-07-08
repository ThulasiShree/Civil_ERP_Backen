import * as mongoose from "mongoose";

export interface AdminDocument extends mongoose.Document {
    _id?: any;
    name?: string;
    mobileNumber?: number;
    email?: string;
   otp?: number;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
};

const AdminSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId,  auto: true },
    name: { type: String },
    mobileNumber: { type: Number },
    email: { type: String, lowercase: true },
    otp: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});


export const Admin = mongoose.model("Admin", AdminSchema);