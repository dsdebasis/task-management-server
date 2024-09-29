import Joi from "joi";

const createUserSchema = Joi.object({
        name:Joi.string().required().min(3).max(25),
        userid:Joi.string().required().min(3).max(15),
        password:Joi.string().required().min(6).max(20),
        role:Joi.string().required().valid("admin","user")
});


const userLoginSchema = Joi.object({
        userid:Joi.string().required().min(3).max(10),
        password:Joi.string().required().min(3).max(20)
})


const taskSchemaByAdmin = Joi.object({
        title:Joi.string().required().min(3).max(50),
        description:Joi.string().required().min(3).max(500),
        status:Joi.string().valid("inProgress","completed","todo").default("todo"),
        priority:Joi.string().valid("high","medium","low").default("low"),
        dueDate:Joi.date().required(),
        assignedUser:Joi.array().items(Joi.string()).required().min(1),
})

const taskSchemaByUser = Joi.object({
        title:Joi.string().required().min(3).max(50),
        description:Joi.string().required().min(3).max(500),
        status:Joi.string().valid("inProgress","completed","todo").default("todo"),
        priority:Joi.string().valid("high","medium","low").default("low"),
        dueDate:Joi.date().required(),
})

const updateTaskSchemaByAdmin = Joi.object({
        id:Joi.string().required(),
        title:Joi.string().min(3).max(50),
        description:Joi.string().min(3).max(500),
        status:Joi.string().valid("inProgress","completed","todo").default("todo"),
        priority:Joi.string().valid("high","medium","low").default("low"),
        dueDate:Joi.date(),
        assignedUser:Joi.array().items(Joi.string()).required().min(1),
})

const updateTaskSchemaByUser = Joi.object({
        id:Joi.string().required(),
        title:Joi.string().min(3).max(50),
        description:Joi.string().min(3).max(500),
        status:Joi.string().valid("inProgress","completed","todo").default("todo"),
        priority:Joi.string().valid("high","medium","low").default("low"),
        dueDate:Joi.date(),
})
export {createUserSchema,userLoginSchema,taskSchemaByAdmin,taskSchemaByUser,updateTaskSchemaByAdmin,updateTaskSchemaByUser};