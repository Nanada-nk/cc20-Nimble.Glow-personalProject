import dotenv from 'dotenv'
import app from "./app.js"
import shutdownUtil from './utils/shutdown.util.js'



dotenv.config()

const PORT = process.env.PORT || 8000 
app.listen(PORT,()=> console.log(`Server on : http://localhost:${PORT}`)) 

process.on("SIGINT",()=>shutdownUtil("SIGINT"))
process.on("SIGTERM",()=>shutdownUtil("SIGTERM"))

process.on("uncaughtException",()=>shutdownUtil("uncaughtException"))
process.on("unhandledRejection",()=>shutdownUtil("unhandledRejection"))