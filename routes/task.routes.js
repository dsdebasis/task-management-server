import {Router} from "express";
import { authenticate } from "../middleware/authenticate.js";
import { 
      createTask, getTask ,getTaskByStatus,
      getTaskByPriority,getTaskByAssignedUser,
      updateTask,getAllUsers,deleteTask,} 

      from "../controllers/task.js";

import { taskSummary } from "../controllers/task.report.js";      
const router = Router();

router.route("/create")
      .post(authenticate,createTask)

// router.route("/create");
// router.route("/delete", authenticate,deleteTask);
router.route("/get-users")
      .get(authenticate,getAllUsers) 
router.route("/get-task/:page")
      .post(authenticate,getTask)      

router.route("/get-taskBy-status")
      .post(authenticate,getTaskByStatus)

router.route("/get-taskBy-priority")
      .post(authenticate,getTaskByPriority)      

router.route("/get-taskBy-assignedUser")
      .post(authenticate,getTaskByAssignedUser)      

router.route("/update-task")
      .post(authenticate,updateTask)      
router.route("/delete-task/:taskId")
      .delete(authenticate,deleteTask)      

router.route("/task-report")
      .get(authenticate,taskSummary)      
export default  router;