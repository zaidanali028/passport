const LocalStrategy=require("passport-local").Strategy
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')


//User model
const User=require('../models/User')

//passport will be defined in the app.js
module.exports=(passport)=>{
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    
                    // null=error
                    // user=false
                    // options
                    //the done here takes the above 3 options
                    return done(null,false,{message:'That email aint registered'})
                }
                //console.log(user.password)
                //MAtch password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err){
                            console.log(err)
                        } 

                        if (isMatch){
                            return done(null,user)
                        }
                        else{
                            return done(null,false,{message:'Password incorrect'})
                        }
                })
            })
            .catch(err=>console.log(err))
        }
        )
    )
//serializing and deserializing credentials(in a form of sessions here)
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


}