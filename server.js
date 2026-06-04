const express = require('express')
const app = express()
const port = 4000
const router = require("./src/routers/index")
const connection = require("./src/databaseStructure/database")
const tables = require("./src/databaseStructure/tables")

tables.init(connection)
router(app)

app.listen(port, ()=>{
    console.log('The server is running')
})