import { User } from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createUserSchema, userLoginSchema } from "../utils/Validate.js";

const register = AsyncHandler(async (req, res, next) => {
  const userDetails = req.body;
  let verifyUserDetails = createUserSchema.validate(userDetails, {
    abortEarly: false,
  });

  const { error, value } = verifyUserDetails;

  try {
    if (error) {
      console.log(value);
      throw new ApiError(400, error.message);
    }
    if (value) {
      const checkExistingUser = await User.findOne({ userid: value.userid });
      if (checkExistingUser) {
        throw new ApiError(400, "UserId is not available");
      }
      const createUser = await User.create(value);
      createUser.password = undefined;

      const token = jwt.sign(
        { id: createUser._id, userid: createUser.userid },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );

      try {
        return res
          .status(201)
          .cookie("userDetails", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          })
          .json(
            new ApiResponse(201, "Registration successfull", createUser, {
              token,
            })
          );
      } catch (error) {
        throw new ApiError(500, error.message);
      }
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const login = AsyncHandler(async (req, res, next) => {
  const userDetails = req.body;

  let verifyUserDetails = userLoginSchema.validate(userDetails, {
    abortEarly: false,
  });

  const { error, value } = verifyUserDetails;
  if (error) {
    throw new ApiError(400, error.message);
  }

  try {
        if (value) {
          const checkUser = await User.findOne({ userid: value.userid });
          if (!checkUser) {
            throw new ApiError(400, "Invalid UserId");
          }
          const checkPassword = await checkUser.matchPassword(value.password);
          if (!checkPassword) {
            throw new ApiError(400, "Invalid Password");
          }
      
          const token = jwt.sign(
            { id: checkUser._id, userid: checkUser.userid },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
          );
      
          return res
            .status(200)
            .cookie("userDetails", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              path: "/",
              expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            })
            .json(new ApiResponse(200, "Login Successfull", checkUser, { token }));
        }
  } catch (error) {
        throw new ApiError(500, error.message);
  }
});

const logout = AsyncHandler(async (req, res, next) => {

        const user = req.user;
  try {
    res.status(200)
       .clearCookie("userDetails",{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
       .json(new ApiResponse(200, "Logout Successfull"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }     
});
export { register, login, logout };
