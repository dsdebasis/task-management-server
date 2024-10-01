import "dotenv/config";
import {app} from "./app.js";

import {dbConfig} from  "./db/dbConfig.js";


dbConfig(process.env.DB_URI).then(()=>{

        app.on("error",()=>{
                console.log("Error in App file")
        })

    const PORT = process.env.PORT || 9100;    
    app.listen(PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`)
})
}).catch((error)=>{
    throw new Error(error)
    console.log("Error while connecting to db",error.message)
})

