const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport=require('passport')




router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body

    //validation
    let errors = []
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in All Fields' })
    }

    if (password !== password2) {
        errors.push({ msg: 'The Passwords You Entered Does Not Match' })

    }

    if (password.length < 6) {
        errors.push({ msg: 'Password Should Be Atleast Six Characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
            //From here,I did partials to render the errors for users
            //to see whats going on


        })
    }
    else {
        //When validation passes,I proceed here
        //res.send('pass')

        User.findOne({email:email})
        .then(user=>{
            if(user){
                errors.push({msg:"User Already Exsists"})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                    //From here,I did partials to render the errors for users
                    //to see whats going on
        
        
                })
            }
            else{
                const newUser=new User({
                    name,
                    email,
                    password
                })
                //we have our new user object now,lets hash
            bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) {
                    console.log(err)
                }
                newUser.password=hash
                newUser.save()
                .then(user=>{
                   // console.log(user)

                   //after defining  the flash message,it wont be displayed unless we display it
                   //to the user and that will be done in views/partials/messages
                   req.flash('success_msg','You are now registered and can login!,Cheese')
                    res.redirect('/users/login')
                })
                .catch(err=>console.log(err))
            }))
            }
        })




    }
    

    //  console.log(req.body)
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)

    //(req,res,next)  is a bit confusin
})

//Logout route
router.get('/logout',(req,res)=>{
    req.logOut()
    req.flash('success_msg','You are logged out')
     res.redirect('/users/login');
})
module.exports = router