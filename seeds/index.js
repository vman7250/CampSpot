// // For express setup 
// const express = require('express');
// const app = express();
// const path = require('path');


//for mongoose and mongodb set up setup
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors,places} = require('./seedHelpers')
// two dots in front of models because you're in another directory


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

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 20) + 1;

const seedDB = async() =>{

    await Campground.deleteMany({});
    for(let i = 0; i< 50;i++){
        const random1000 = Math.floor(Math.random()*100);
        const camp = new Campground({
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)}  ${sample(places)}`,
            image : `https://source.unsplash.com/collection/483251`,
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores labore, est iste, numquam laborum suscipit, veniam similique pariatur vel nihil adipisci provident dolorum temporibus debitis voluptas? Quidem, odio deleniti. Architecto.',
            price : price

        })
        await camp.save();
    }
    
    

}

seedDB().then(()=>{
    mongoose.connection.close();
})