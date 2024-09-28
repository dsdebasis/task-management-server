import Joi from "joi";

const createUserSchema = Joi.object({
        name:Joi.string().required().min(3).max(25),
        userid:Joi.string().required().min(3).max(15),
        password:Joi.string().required().min(6).max(20)

});


const userLoginSchema = Joi.object({
        userid:Joi.string().required().min(3).max(10),
        password:Joi.string().required().min(3).max(20)
})

export {createUserSchema,userLoginSchema};