import mongoose, { mongo } from "mongoose"
const dbConfig = async function (uri) {
       try {
       const db = await  mongoose.connect(uri);
       console.log("database connected",db.connection.host);
       } catch (error) {
        console.log("Error while Connecting to DB",error)
        process.exit(1)
       }
}
export  {dbConfig}