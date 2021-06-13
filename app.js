// For express setup 
const express = require('express');
const app     = express();
const path    = require('path');

//for session

const session = require('express-session')

// for connecting flash
const flash = require('connect-flash')

// session config
const sessionConfig = {
    
    secret : 'this should be a better secret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpsOnly : true,
        expires  : Date.now() + 1000 + 60 * 60 * 24,
        maxAge   : 1000 + 60 * 60 * 24   
    }
}
app.use(session(sessionConfig)) 

app.use(flash())

const { campgroundSchema,reviewSchema } = require('./schemas.js');

const Joi            = require('joi'); // joi import

const ejsMate        = require('ejs-mate') //  

const methodOverride = require('method-override')

//for my error handling from utils
const ExpressError = require('./utils/ExpressError')

//for mongoose and mongodb set up setup

const mongoose     = require('mongoose')
const Campground   = require('./models/campground');
const Review       = require('./models/review.js')
const catchAsync   = require('./utils/catchAsync');
const { validate } = require('./models/campground');

const campgrounds = require('./routes/campgrounds');
const reviews     = require('./routes/reviews');

//mongoose setup 

mongoose.set('useFindAndModify', false); //for deprecation

mongoose.connect('mongodb://localhost:27017/campSpot', {
    useNewUrlParser: true, 
    useCreateIndex:true, 
    useUnifiedTopology: true, 
    useFindAndModify : false})

    .then(() => {
    console.log('Connection ON')
        })
        
        .catch(err=>{
            
            console.log('Oh no error buddy')
            console.log(err)
            
        });
        
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('Database connected')
        });
                


        // for ejs setup

app.set('view engine', 'ejs') // ejs
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({ extended:true})) //for the form    
app.engine('ejs',ejsMate);


        //for public static file 

app.use(express.static(path.join(__dirname,'public')))


        //for method-overide

app.use(methodOverride('_method'))


        //flash success

app.use(( req,res,next) => {
res.locals.success = req.flash('success')
res.locals.error = req.flash('error')
next()
    })



        // routing
app.use ( '/campgrounds',campgrounds )
app.use ( '/campgrounds/:id/reviews', reviews )
  


//handles error any other request aka default

app.all('*',(req,res,next) => {
    
    next(new ExpressError('Page not found',404))

    })
    
app.get('/',(req,res) => {
        res.send('home')
    })
    


    //error handling step one

app.use(( err,req,res,next ) => {
    
    const {statusCode = 500} = err //creating a default value for our status code and message
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error',{ err });

})

app.listen( '3000', () => {
    console.log ( 'Serving on port 3000' )
})