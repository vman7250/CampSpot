// For express setup 
const express = require('express');
const app = express();
const path = require('path');

const { campgroundSchema } = require('./schemas.js');
console.log(`campgrounds ${typeof(campgroundSchema)}`);


const Joi = require('joi'); //joi import

const ejsMate = require('ejs-mate')

const methodOverride = require('method-override')

//for my error handling from utils

const CatchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

//for mongoose and mongodb set up setup

const mongoose = require('mongoose')
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const { validate } = require('./models/campground');
mongoose.set('useFindAndModify', false); //for deprecation

mongoose.connect('mongodb://localhost:27017/campSpot', {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true})
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

//for method-overide

app.use(methodOverride('_method'))


/////// 

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/campgrounds',catchAsync(async (req,res)=>
{
    const camp = await Campground.find({});
    console.log(camp)
    res.render('campgrounds/index.ejs',{camp});
}))

const validateCampground = (req, res, next) => {
    console.log(req)
    const  {error}  = campgroundSchema.validate(req.body);
    console.log(` First error: ${error}  `)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log(`Message from validation: ${msg}`)
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



//create
app.get('/campgrounds/new', (req,res)=>
{
    
    res.render('campgrounds/new.ejs',);
})





// create post

app.post('/campgrounds',validateCampground,catchAsync(async (req,res)=>{
        // if(!req.body.campground)throw new ExpressError('Invalid Campground Data',400)
        console.log(req.body)
        const campground = new Campground(req.body.campground);
        await campground.save();

        res.redirect(`/campgrounds/${campground._id}`);

}))


//update

app.get('/campgrounds/:id/update',catchAsync(async(req,res)=>
{   
    
    const campground = await Campground.findById(req.params.id);
    
    res.render(`campgrounds/update`,{campground});
}))

//update post

app.put('/campgrounds/:id', catchAsync(async (req,res)=>{
    
    const {id} = req.params;
    const item = req.body
    const campground = await Campground.findOneAndUpdate(id,{...item.campground},{new:true})
    res.redirect(`/campgrounds/${id}`);
    
}))

//delete function 
app.delete('/campgrounds/:id', catchAsync (async (req,res)=>{
    const {id} = req.params;
    const deleteCamp = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');
}))


//display camp
app.get('/campgrounds/:id',catchAsync (async (req,res)=>
{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    //console.log(camp)
    res.render('campgrounds/show.ejs',{camp});
}))

//handles error any other request aka default
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

//error handling step one

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err //creating a default value for our status code and message
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error',{err});
})

app.listen('3000', ()=>{
    console.log('Serving on port 3000')
})