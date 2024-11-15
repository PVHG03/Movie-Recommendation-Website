import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

import { UserDocument } from "../models/user.model";
import { Audience } from "../constants/audience";
import { JWT_SECRET } from "../constants/env";

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

export type AccessTokenPayload = {
  userId: UserDocument["_id"];
};

const defaults: SignOptions = {
  audience: [Audience.USER],
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...signOptions } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOptions,
  });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret?: string }
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};

  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    }) as TPayload;
    return { payload };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
