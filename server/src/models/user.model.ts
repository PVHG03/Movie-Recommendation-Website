import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  omitSensitive(): Pick<
    UserDocument,
    "_id" | "email" | "name" | "role" | "createdAt" | "updatedAt"
  >;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  return hashValue(this.password);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.omitSensitive = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model<UserDocument>("User", userSchema);
