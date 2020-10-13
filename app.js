const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

const flash =require('connect-flash')
con-st session=require('express-session')
const passport=require('passport')
//passport config
require('./config/passport')(passport)

app = express()

//Default BodyPArser
app.use(express.urlencoded({extended:false}))

//express-sesion and flash middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))

  //This should alwayse between session and flash
app.use(passport.initialize());
app.use(passport.session());



app.use(flash())


//Global variables for flash messages
app.use((req,res,next)=>{
    //inorder to declare a local variable,you do:
    // res.locals then the variablename
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()

})

//db onlline
//DBCONFIG
// const db = require('./config/keys').MongoURI

//connecting to db
// mongoose.connect(
//     db,  { useUnifiedTopology: true })
//     .then(console.log('db connected'))
//     .catch((err) => {
//         console.log(err, "Error Connecting to local db")
//     })



//Db Offline
mongoose.connect(
    'mongodb://localhost:27017/passport',
    { useUnifiedTopology: true ,useUnifiedTopology:true,useFindAndModify:false}

)
    .then(console.log('db connected'))
    .catch((err) => {
        console.log(err, "Error Connecting to local db")
    })
app.use(expressLayouts)
app.set('view engine', 'ejs')


const indexRouter = require('./routes/index')
app.use('/', indexRouter)


const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.listen(5030, () => {
    console.log('server started on port 5050')

})