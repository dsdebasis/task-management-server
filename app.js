import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import  userRouter from "./routes/user.routes.js";
import  taskRouter from "./routes/task.routes.js";

const app = express();
 const corsOption = {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
}

app.use(express.json());
app.use(express.urlencoded({ extended: true ,limit:"16kb"}));
app.use(express.static("public"));
app.use(cors(corsOption));
app.use(cookieParser());


app.get("/",(req,res)=>{
        res.send("server is up and running")
})
app.use("/api/v1/users",userRouter);
app.use("/api/v1/tasks",taskRouter);

export {app}