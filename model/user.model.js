import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const userSchema = new Schema({
        name:{
                type:String,
                required:[true,"A user Nmae is required"],
                trim:true,

        },
        userid:{
                type:String,
                required:[true,"A user Id is required"],
                trim:true,
                unique:true,
                lowercase:true
        },
        password:{
                type:String,
                required:[true,"A user password is required"],
                
        },
        role:{
                type:String,
                enum:["admin","user"],
                default:"user"
        }
})

userSchema.pre("save",async function(next){
        
        if(!this.isModified("password")) return next()
                
                this.password =  await  bcrypt.hash(this.password,10);
                
        })
        
        userSchema.methods.matchPassword = async function(password){
                return await bcrypt.compare(password,this.password)
        }
        
 userSchema.plugin(mongooseAggregatePaginate)
const User = mongoose.model("User",userSchema);

export {User}