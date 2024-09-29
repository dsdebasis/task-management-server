import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import { Task } from "../model/task.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const taskSummary = AsyncHandler(async (req, res, next) => {
  const user = req.user;

  // console.log(user)
 try {
   let taskDetails = {
     taskAssignedByAdmin:0, taskCreatedByUser:0,taskByPriorityLow:0,taskByPriorityHigh:0,
     taskByPriorityMedium:0, taskByStatusTodo:0,taskByStatusProgress:0,taskByStatusCompleted:0,
   };
 
 Completed,
  //  } = taskDetails;
 
 
     taskDetails.taskAssignedByAdmin = await Task.countDocuments({
      assignedUser: user.userid})
     
     taskDetails.taskCreatedByUser = await Task.countDocuments({
       createdBy: user.id})
     
     taskDetails.taskByPriorityLow = await Task.countDocuments({
       priority: "low",})
     
     taskDetails.taskByPriorityHigh = await Task.countDocuments({
       priority: "high",})
     
     taskDetails.taskByPriorityMedium = await Task.countDocuments({
       priority: "medium"})
     
     taskDetails.taskByStatusTodo = await Task.countDocuments({
       status: "todo",})
     
     taskDetails.taskByStatusProgress = await Task.countDocuments({
       status: "progress",})
     
     taskDetails.taskByStatusCompleted = await Task.countDocuments({
       status: "completed",})
 
       return res.status(200).json(new ApiResponse(200, "Task Summary", taskDetails));
 } catch (error) {
  throw new ApiError(500,error.message);
 }



});

export { taskSummary };
