import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import { Task } from "../model/task.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const taskSummary = AsyncHandler(async (req, res, next) => {
  const user = req.user;

  if (user.role == "user") {
    try {
      let taskDetails = {
        taskAssignedByAdmin: 0,
        taskCreatedByUser: 0,
        taskByPriorityLow: 0,
        taskByPriorityHigh: 0,
        taskByPriorityMedium: 0,
        taskByStatusTodo: 0,
        taskByStatusProgress: 0,
        taskByStatusCompleted: 0,
      };

      //  Completed,
      //  } = taskDetails;

      taskDetails.taskAssignedByAdmin = await Task.countDocuments({
        assignedUser: user.userid,
      });

      taskDetails.taskCreatedByUser = await Task.countDocuments({
        createdBy: user.id,
      });

      taskDetails.taskByPriorityLow = await Task.countDocuments({
        priority: "low",
        assignedUser: user.userid,
      });

      taskDetails.taskByPriorityHigh = await Task.countDocuments({
        priority: "high",
        assignedUser: user.userid,
      });

      taskDetails.taskByPriorityMedium = await Task.countDocuments({
        priority: "medium",
        assignedUser: user.userid,
      });

      taskDetails.taskByStatusTodo = await Task.countDocuments({
        status: "todo",
        assignedUser: user.userid,
      });

      taskDetails.taskByStatusProgress = await Task.countDocuments({
        status: "inProgress",
        assignedUser: user.userid,
      });

      taskDetails.taskByStatusCompleted = await Task.countDocuments({
        status: "completed",
        assignedUser: user.userid,
      });

      let summary = (`Hey user, . Your user id is ${user.userid}. Your task details are. Toal task you have ---- ${taskDetails.taskAssignedByAdmin}, total task created by you ---- is  ${taskDetails.taskCreatedByUser}. Task in high Priority --- 
           ${taskDetails.taskByPriorityHigh},  Task in low Priority --- ${taskDetails.taskByPriorityLow}, Task in medium Priority --- ${taskDetails.taskByPriorityMedium}.
           Task by status todo --- ${taskDetails.taskByStatusTodo}, Task by status in progress --- ${taskDetails.taskByStatusProgress}, Task by status completed --- ${taskDetails.taskByStatusCompleted}.`)

          //  console.log(summary)
      return res.status(200).json(new ApiResponse(200, summary, taskDetails));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  } else if (user.role == "admin") {
    try {
      let taskDetails = {
        totalTask: 0,
        taskCreatedByUser: 0,
        taskByPriorityLow: 0,
        taskByPriorityHigh: 0,
        taskByPriorityMedium: 0,
        taskByStatusTodo: 0,
        taskByStatusProgress: 0,
        taskByStatusCompleted: 0,
      };
  
       taskDetails.totalTask = await Task.countDocuments();
       taskDetails.taskCreatedByUser = await Task.countDocuments({createdBy:user.id})
       taskDetails.taskByPriorityLow = await Task.countDocuments({priority:"low"});
       taskDetails.taskByPriorityMedium= await Task.countDocuments({priority:"medium"});
       taskDetails.taskByPriorityHigh = await Task.countDocuments({priority:"high"});
       taskDetails.taskByStatusTodo = await Task.countDocuments({status:"todo"});
       taskDetails.taskByStatusProgress = await Task.countDocuments({status:"inProgress"});
       taskDetails.taskByStatusCompleted = await Task.countDocuments({status:"completed"});
  
       let summary = (`Hey user, . Your user id is ${user.userid}. Your task details are. Toal task you have ---- ${taskDetails.totalTask}, total task created by you ---- is  ${taskDetails.taskCreatedByUser}. Task in high Priority --- 
        ${taskDetails.taskByPriorityHigh},  Task in low Priority --- ${taskDetails.taskByPriorityLow}, Task in medium Priority --- ${taskDetails.taskByPriorityMedium}.
        Task by status todo --- ${taskDetails.taskByStatusTodo}, Task by status in progress --- ${taskDetails.taskByStatusProgress}, Task by status completed --- ${taskDetails.taskByStatusCompleted}.`)

       return res.status(200).json(new ApiResponse(200, summary,taskDetails));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  }
});

export { taskSummary };
