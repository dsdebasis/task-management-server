const AsyncHandler = (reqHandler) => async (req,res,next)=>{
        try {
                return await reqHandler(req,res,next);
        } catch (error) {
                res.status(500).json({
                    success:false,
                    message:error.message,
                    data:error,
                })
        }
}

export  {AsyncHandler};