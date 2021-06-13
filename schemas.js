const Joi = require('joi');
// const mongoose = require('mongoose')
// const Campground = require('./models/campground');




module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({
        
        title    : Joi.string().required(),
        price    : Joi.number().required().min(0),
        image    : Joi.string().required(),
        location : Joi.string().required(),
        description: Joi.string().required()
    }).required()
    })


module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        
        rating    : Joi.number().required(),
        body    : Joi.string().required(),
        
    }).required()
    
})



// const express = require('express');
// const app = express();
// const path = require('path');

// const ejsMate = require('ejs-mate')

// const methodOverride = require('method-override')


