import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"

const authenticate = AsyncHandler(async (req,res,next)=>{
   const findToken = req.cookies.userDetails ||
                     req.header("Authorization")?.replace("Bearer ","");

         if(!findToken){
          throw new ApiError(400,"Please Login First");
         }   
         
         const verifyToken = jwt.verify(findToken,process.env.JWT_SECRET);
        //  console.log(verifyToken);
         
         if(verifyToken){
          req.user = verifyToken;
          next();
         }else{
          throw new ApiError(400,"Invalid credentials");
         }
        
})

export {authenticate};

const checAdmin = AsyncHandler(async (req,res,next)=>{

        if(req.user.role !== "admin"){
          throw new ApiError(400,"Access Denied");
        }
        next();
})