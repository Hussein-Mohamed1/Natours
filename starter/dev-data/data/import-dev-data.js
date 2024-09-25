const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require(`${__dirname}/../../models/tourModel`);
const User = require(`${__dirname}/../../models/UserModel`);
const Review = require(`${__dirname}/../../models/ReviewModel`);

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => {
    console.log('DB connection successful');
}).catch(err => console.log(`error is ${err}`));

// read data from file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// import data into database
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users , { validateBeforeSave: false });
        await Review.create(reviews);
        console.log(' Data successfully loaded');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

// delete data from database

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log(' Data successfully deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import')
    importData();
else if (process.argv[2] === '--delete')
    deleteData();