const express=require('express')
const router=express.Router()
const {ensureAuthenticated}=require('../config/auth')
//Welcome page
router.get('/',(req,res)=>{
    res.render('welcome')
})


//Dashboard pae
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        username:req.user.name
    })
})

module.exports=router