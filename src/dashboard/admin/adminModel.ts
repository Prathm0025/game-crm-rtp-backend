import { model, Model, Schema } from "mongoose";
import { IUser } from "../users/userType";
import { UserSchema } from "../users/userModel";
import { IAdmin } from "./adminType";

const AdminSchema = new Schema<IAdmin>({
    ...UserSchema.obj,
    role: { type: String, default: "admin", immutable: true },
    credits: { type: Number, default: Infinity, immutable: true },
})

export const Admin: Model<IAdmin> = model("Admin", AdminSchema);