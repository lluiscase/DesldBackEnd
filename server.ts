import router from "./src/routers";
import express from "express";
import connection from "./src/database/database";
import tables from "./src/database/tables";
const app = express()
const port = 4000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static('uploads'))

tables.init(connection)
router(app)

app.listen(port, ()=>{
    console.log('The server is running')
})