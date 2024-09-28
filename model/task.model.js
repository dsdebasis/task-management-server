import mongoose,{Schema} from "mongoose";

const taskSchema = new Schema({
        name:{
                type:String,
                required:[true,"A task name is required"],
                trim:true,
                lowercase:true,
        },
        description:{
                type:String,
                required:[true,"A task description is required"],
                trim:true
        },
        status:{
                type:String,
                enum:["inProgress","completed","to do"],
                required:[true,"A task status is required"],
        },
        priority:{
                type:String,
                enum:["high","medium","low"],
                required:[true,"A task priority is required"],
        },
        assignedUser:[{
                type:Schema.Types.ObjectId,
                ref:"User"
        }],
        dueDate:{
                type:Date,
                required:[true,"A task due date is required"],
        },

},{timestamps:true});

const Task = mongoose.model("Task",taskSchema);

export {Task};