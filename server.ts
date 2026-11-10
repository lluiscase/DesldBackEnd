import router from "./src/routers";
import express from "express";
import fs from "fs";
import connection from "./src/database/database";
import tables from "./src/database/tables";
const app = express()
const port = Number(process.env.PORT) || 4000

fs.mkdirSync('uploads', { recursive: true })

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static('uploads'))

tables.init(connection)
router(app)

app.listen(port, ()=>{
    console.log('The server is running')
})
