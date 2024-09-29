import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const taskSchema = new Schema({
        title:{
                type:String,
                required:[true,"A task title is required"],
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
                enum:["inProgress","completed","todo"],
                required:[true,"A task status is required"],
        },
        priority:{
                type:String,
                enum:["high","medium","low"],
                required:[true,"A task priority is required"],
        },
        assignedUser:[{
                type:String,
                required:[true,"A task assigned user is required"],
                trim:true,
                lowercase:true,
        }],
        dueDate:{
                type:Date,
                required:[true,"A task due date is required"],
        },
        createdBy:{
               type:Schema.Types.ObjectId,
               ref:"User",
               required:true,
        }

},{timestamps:true});

taskSchema.plugin(mongooseAggregatePaginate)
const Task = mongoose.model("Task",taskSchema);

export {Task};