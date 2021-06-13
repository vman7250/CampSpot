const express = require('express')

const router = express.Router({ mergeParams: true });
const {reviewSchema}  = require('../schemas.js');

const Campground   = require('../models/campground');
const Review       = require('../models/review.js')
const { validate } = require('../models/campground');

const catchAsync   = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');






const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }   else { next(); }

}






  // review post

  router.post('/',validateReview, catchAsync(async (req,res)=>{
  
    const item = req.body
    
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    
    req.flash('success','Your review has been added')
    res.redirect(`/campgrounds/${campground._id}`);
    
    }))

// Review Delete

router.delete('/:reviewId',catchAsync(async(req,res) => {

    const {id,reviewId} = req.params;
    
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : { reviewId } } } )
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Your review has been deleted')
    res.redirect(`/campgrounds/${id}`)
    
}))


module.exports = router
    
     

