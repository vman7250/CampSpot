const express = require('express');

const router = express.Router({ mergeParams: true });

const { campgroundSchema } = require('../schemas.js');

const catchAsync = require('../utils/catchAsync');

const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/campground');

const { validate } = require('../models/campground');


const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);


    if (error) {
        const msg = error.details.map(el => el.message).join(',')

        throw new ExpressError(msg, 400)
    }   else { next(); }
}

//home or index page

router.get('/', catchAsync(async (req, res) => {
    const camp = await Campground.find({});

    res.render('campgrounds/index.ejs', { camp });
}))

//create

router.get(
    '/new',
    (req, res) => { res.render('campgrounds/new.ejs',); }
)

//display/show camp

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error','cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', { camp });

}))

// create post

router.post('/', validateCampground, catchAsync(async (req, res) => {
    
    // if(!req.body.campground)throw new ExpressError('Invalid Campground Data',400)

    console.log(req.body)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`);

}))

//update

router.get('/:id/update', catchAsync(async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds') }
    
    res.render(`campgrounds/update`, { campground });

}))

//update post

router.put('/:id',validateCampground, catchAsync(async (req, res) => {

    const { id } = req.params;
    const item = req.body
    const campground = await Campground.findByIdAndUpdate(id, { ...item.campground }, { new: true })
    req.flash('success', 'Successfully updated campground')   
    res.redirect(`/campgrounds/${campground._id}`);

}))

//delete function 
// delete

router.delete('/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    const deleteCamp = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')   
    res.redirect('/campgrounds');

}))



module.exports = router;