import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import { User } from "../models/user.model";
import appAssert from "../utils/appAssert";
import AppError from "../utils/AppError";
import { signToken } from "../utils/jwt";
import neo4jClient from "../utils/Neo4j";

export interface AccountParams {
  email: string;
  password: string;
  name: string;
}

export const createAccount = async (data: AccountParams) => {
  const existingUser = await User.exists({
    email: data.email,
  });
  appAssert(!existingUser, CONFLICT, "Email is already used");

  const user = await User.create({
    email: data.email,
    password: data.password,
    name: data.name,
  });

  const userId = user._id;
  // try {
  //   await neo4jClient.createNode({
  //     label: "User",
  //     properties: {
  //       userId: userId.toString(),
  //       name: user.name,
  //     },
  //   });
  // } catch (error) {
  //   await User.findByIdAndDelete(userId);
  //   throw new AppError(
  //     CONFLICT,
  //     "Failed to create user in graph database. Rollback user creation in MongoDB"
  //   );
  // }

  const accessToken = signToken({
    userId,
  });

  return {
    user: user.omitSensitive(),
    accessToken,
  };
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async (data: LoginParams) => {
  const user = await User.findOne({ email: data.email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const isMatch = await user.comparePassword(data.password);
  appAssert(!isMatch, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;
  const accessToken = signToken({
    userId,
  });

  return {
    user: user.omitSensitive(),
    accessToken,
  };
};
