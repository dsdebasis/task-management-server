import { Task } from "../model/task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import {
  taskSchemaByAdmin,
  taskSchemaByUser,
  updateTaskSchemaByAdmin,
  updateTaskSchemaByUser,
} from "../utils/Validate.js";
import { User } from "../model/user.model.js";

const getAllUsers = AsyncHandler(async (req, res, next) => {
  const user = req.user;

  if (user.role !== "admin") {
    throw new ApiError(400, "Only admins can perform this action");
  }

  const findAllUser = await User.find({ role: "user" }).select("userid");

  // console.log(findAllUser)
  if (!findAllUser) throw new ApiError(400, "No user found");

  return res.status(200).json(new ApiResponse(200, "All Users", findAllUser));
});

const createTask = AsyncHandler(async (req, res, next) => {
  const user = req.user;
  const taskDetils = req.body;

  try {
    // checking for admin users
    if (user.role == "admin") {
      //verifying taskDetails by joi validator
      const checkTaskDetails = taskSchemaByAdmin.validate(taskDetils, {
        abortEarly: false,
      });

      //extracting any error while vallidation
      const { error, value: validatedTaskDetails } = checkTaskDetails;
      //
      if (error) {
        throw new ApiError(400, error.message);
      }

      //adding createdBy feild for task creaters
      validatedTaskDetails.createdBy = user.id;

      let convertAssignedUsersToArray = validatedTaskDetails.assignedUser.split(" ")
    // console.log(convertAssignedUsersToArray)
    validatedTaskDetails.assignedUser = convertAssignedUsersToArray;
      const seletedUsers = validatedTaskDetails.assignedUser

      // console.log(Array.isArray(seletedUsers))
      const findAllUser = await User.find({userid: {$in: seletedUsers}})

      // console.log("findall users",findAllUser);
      if (!findAllUser || findAllUser.length == 0) {
        throw new ApiError(400, "no user found");
      }

      if(findAllUser.length != seletedUsers.length){
        throw new ApiError(400, "one or more userid does not found");
      }

      try {
        const createTask = await Task.create(validatedTaskDetails);
        // console.log(createTask);

        return res
          .status(201)
          .json(new ApiResponse(201, "Task created", createTask));
      } catch (error) {
        throw new ApiError(500, error.message);
      }
    } else if (user.role == "user") {
      const checkTaskDetails = taskSchemaByUser.validate(taskDetils, {
        abortEarly: false,
      });

      const { error, value: validatedTaskDetails } = checkTaskDetails;
      if (error) {
        throw new ApiError(400, error.message);
      }

      validatedTaskDetails.createdBy = user.id;
      validatedTaskDetails.assignedUser = [user.userid];
      try {
        const createTask = await Task.create(validatedTaskDetails);
        return res
          .status(201)
          .json(new ApiResponse(201, "Task created", createTask));
      } catch (error) {
        throw new ApiError(500, error.message);
      }
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getTask = AsyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  // console.log(req.query);
  if (req.user.role == "user") {
    const findAllTask = await Task.find({
      $or:[{createdBy: req.user.id},{assignedUser:{$in:[req.user.userid]}}]
    })
      .skip((page - 1) * 5)
      .limit(5);

    if (!findAllTask || findAllTask.length == 0) {
      throw new ApiError(400, "No task found");
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, "All Task", findAllTask));
    }
  }

  if (req.user.role == "admin") {
    const findAllTask = await Task.find()
      .skip((page - 1) * 5)
      .limit(5);
    if (!findAllTask || findAllTask.length == 0) {
      throw new ApiError(400, "No task found");
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, "All Task", findAllTask));
    }
  }
});

const getTaskByStatus = AsyncHandler(async (req, res, next) => {
  // console.log("checked",req.user)
  if (!req.body.status) {
    throw new ApiError(400, "Please provide status");
  }

  if (
    req.body.status === "todo" ||
    req.body.status === "inProgress" ||
    req.body.status === "completed"
  ) {
    if (req.user.role == "user") {
      // console.log("user");
      const findAllTask = await Task.aggregate([
        {
          $match: {
            $or: [
              
              { assignedUser: { $in: [req.user.userid] } },
              { createdBy: req.user.id },
            ],
          },
        },
        {
          $match: { status: req.body.status },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            status: 1,
            assignedUser: 1,  
            dueDate: 1,
          },
        },
      ])

      if (!findAllTask || findAllTask.length == 0) {
        throw new ApiError(400, "No task found based on status");
      } else {
        return res
          .status(200)
          .json(new ApiResponse(200, "All Task", findAllTask));
      }
    } else if (req.user.role == "admin") {
        // console.log("admin");
      const findAllTask = await Task.find({ status: req.body.status }).select(
        "-priority -createdAt -updatedAt"
      );

        // console.log(findAllTask);
      if (!findAllTask || findAllTask.length == 0) {
        throw new ApiError(400, "No task found based on status");
      } else {
        return res
          .status(200)
          .json(new ApiResponse(200, "All Task", findAllTask));
      }
    }
  } else {
    throw new ApiError(400, "Please provide valid status");
  }
});

const getTaskByPriority = AsyncHandler(async (req, res, next) => {
  if (!req.body.priority) {
    throw new ApiError(400, "Please provide priority");
  }

  if (
    req.body.priority === "low" ||
    req.body.priority === "medium" ||
    req.body.priority === "high"
  ) {
    if (req.user.role == "user") {
      const findTask = await Task.aggregate([
        {
          $match: {
            $or: [
              { assignedUser: { $in: [req.user.userid] } },
              { createdBy: req.user.id },
            ],
          },
        },{
          $match: { priority: req.body.priority },
        },{
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            priority: 1,
            assignedUser: 1,  
          },
        }
      ])

      if (!findTask || findTask.length == 0) {
        throw new ApiError(400, "No task found based on priority");
      } else {
        return res.status(200).json(new ApiResponse(200, "All Task", findTask));
      }
    } else if (req.user.role == "admin") {

      const findTask = await Task.find({
        priority: req.body.priority,
      
      }).select(" -createdAt -updatedAt -status ");
      if (!findTask || findTask.length == 0) {
        throw new ApiError(400, "No task found based on priority");
      } else {
        return res.status(200).json(new ApiResponse(200, "All Task", findTask));
      }
    }
  } else {
    throw new ApiError(400, "Please provide valid priority");
  }
});

const getTaskByAssignedUser = AsyncHandler(async (req, res, next) => {
  const user = req.user;

  if (user.role == "admin") {
    if (!req.body.assignedUser) {
      throw new ApiError(400, "Please provide assignedUser");
    }
    const findTask = await Task.find({
      assignedUser: req.body.assignedUser,
   
    }).select("-priority -status -createdAt -updatedAt");
    if (!findTask || findTask.length == 0) {
      throw new ApiError(400, "No task found based on assignedUser");
    } else {
      return res.status(200).json(new ApiResponse(200, "All Task", findTask));
    }
  } else {
    throw new ApiError(400, "Only admins can perform this action");
  }
});

const updateTask = AsyncHandler(async (req, res, next) => {
  const user = req.user;

  //  const {updateDetails} = req.body;
  // console.log(req.body)
  if (user.role == "admin") {
    const validateUpdateTask = updateTaskSchemaByAdmin.validate(req.body, {
      abortEarly: false,
    }); 

    const { error, value } = validateUpdateTask;
    // console.log("val",value,error)
    if (error) {
      throw new ApiError(400, error.message);
    }

    value.assignedUser = value.assignedUser.split(" ");
    const findAllUser = await User.find({userid: {$in: value.assignedUser}})


    if (!findAllUser || findAllUser.length == 0) {
      throw new ApiError(400, "no user found");
    }

    if(findAllUser.length != value.assignedUser.length){
      throw new ApiError(400, "one or more userid does not found");
    }

    try {
      const updateTask = await Task.findOneAndUpdate(
        { _id: value?.id },
        { $set: value },
        { new: true }
      );

      if (!updateTask || updateTask.length == 0) {
        throw new ApiError(400, "Unable to update task");
      } else {
        return res
          .status(200)
          .json(new ApiResponse(200, "Task updated", updateTask));
      }
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  } else if (user.role == "user") {
    const validateUpdateTask = updateTaskSchemaByUser.validate(req.body, {
      abortEarly: false,
    });

    const { error, value } = validateUpdateTask;
    if (error) {
      throw new ApiError(400, error.message);
    }

    const findTask = await Task.findOne({ _id: value?.id, createdBy: user.id });

    console.log(findTask);
    if (!findTask || findTask.length == 0) {
      throw new ApiError(400, "Unable to update task");
    }
  }
});

const deleteTask = AsyncHandler(async (req, res, next) => {
  const user = req.user;
  // console.log(req.params.taskId)
  // console.log(user)
  if(user.role == "admin"){
    if(!req.params?.taskId){
      throw new ApiError(400, "Please provide task id");
    }
    const deleteTask = await Task.deleteOne({ _id: req.params?.taskId });
    if (!deleteTask || deleteTask.length == 0) {
      throw new ApiError(400, "Unable to delete task");
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, "Task deleted", deleteTask));
    }
  }
  if(user.role == "user"){
     
    if(!req.params?.taskId){
      throw new ApiError(400, "Please provide task id");
    }
    const findTaskCreatedByUser = await Task.findOne({
      $and:[{createdBy: user.id},{_id: req.params?.taskId}]
    });
    // console.log(findTaskCreatedByUser)
    if (!findTaskCreatedByUser || findTaskCreatedByUser.length == 0) {
      throw new ApiError(400, "you can not delete task thar are not created by you");
    } else {
      // return res.status(200).json(new ApiResponse(200, "Task deleted", findTaskCreatedByUser));
      // console.log(req.params.taskId)
      const deleteTask = await Task.findOneAndDelete({ _id: req.params?.taskId }, { new: true });
      // console.log(deleteTask)
      if (!deleteTask || deleteTask.length == 0) {
        throw new ApiError(400, "Unable to delete task");
      }

      return res.status(200).json(new ApiResponse(200,"Task deleted",deleteTask));
      
    }
  }
});

export {
  getAllUsers,
  createTask,
  getTask,
  getTaskByStatus,
  getTaskByPriority,
  getTaskByAssignedUser,
  updateTask,
  deleteTask
};
