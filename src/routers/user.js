//const Router = require('express').Router
const { Router } = require("express")

const router = Router()

//get
router.get("/user", (req,res)=>{
    res.send()
});
//post
router.post("/user", (req,res)=>{
    res.send()
});
//put
router.put("/user/:id", (req,res)=>{
    const {id} = req.params
    res.send()
});
//delete
router.delete("/user/:id", (req,res)=>{
    const {id} = req.params
    res.send()
});

module.exports = router