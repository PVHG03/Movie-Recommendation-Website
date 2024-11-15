import { CREATED, OK } from "../constants/http";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createAccount, loginUser } from "../services/auth.service";
import catchError from "../utils/catchError";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { verifyToken } from "../utils/jwt";

export const registerHandler = catchError(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { user, accessToken } = await createAccount(request);
  setAuthCookies({ res, accessToken });
  return res.status(CREATED).json(user);
});

export const loginHandler = catchError(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  })
  const { accessToken } = await loginUser(request);
  setAuthCookies({ res, accessToken });
  return res.status(OK).json({
    message: "Login successful",
  });
}); 

export const logoutHandler = catchError(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  clearAuthCookies({ res });
  return res.status(OK).json({
    message: "Logout successful",
  });
})