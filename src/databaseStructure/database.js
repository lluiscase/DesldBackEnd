const mysql = require('mysql2')
const connection = mysql.createConnection({
    host:"localhost",
    port:3306, //Pode mudar dependendo de como você configurou
    user:"root", //Pode mudar dependendo de como você configurou
    password:"root", //Pode mudar dependendo de como você configurou
    database:"desld" //Pode mudar dependendo de como você configurou
})

module.exports = connection