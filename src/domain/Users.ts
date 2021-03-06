import mongoose from "mongoose";

export enum Role { ADMIN = "ADMIN", USER = "USER", GUEST = "GUEST" }

export interface User {
    name?: string;
    email?: string;
    password?: string;
    role?: string
    phone?: string;
    address?: string;
    authToken?: string;
}

const schema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String },
    address: { type: String }
}, { timestamps: true });

export const UserModel = mongoose.model("user", schema);
