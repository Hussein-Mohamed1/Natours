const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
const validator = require('validator');
const tourschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Tour Must Have a Name'],
        unique: true,
        trim: true,
        minlength: [10, 'The minimum length of a tour name must be at least 10 characters'],
        maxlength: [40, 'The maximum length of a tour name must be at most 40 characters'],
        // validate: [validator.isAlpha , 'The name must be a valid alpha']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A Tour Must Have a Duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: "Difficulty is either: easy or medium or difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Ratings must be above 1.0'],
        max: [5, 'Ratings must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A Tour Must Have a price'],
        set: function (value) {
            if (typeof value === 'string') {
                throw new Error('Price must be a number, not a string.');
            }
            return value;
        }
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (value) {
                return value < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
})


tourschema.index({ price: 1, ratingsAverage: -1 });
tourschema.index({ slug: 1 });
tourschema.index({ startLocation: '2dsphere' });


tourschema.virtual('durationWeeks').get(function () {
    if (this.duration)
        return this.duration / 7;
})

tourschema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

// doc middleware
tourschema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

// tourschema.pre('save', async function (next) {
//     const guidesProms = this.guides.map(id => User.findById(id));
//     this.guides = await Promise.all(guidesProms);
//     next();
// })

// tourschema.post('save' , function (doc , next) {
//     console.log(doc);
//     next();
// })
// Query Middleware

tourschema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
})

tourschema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangeAt -passwordResetToken -passwordResetExpires'
    })
    next();
})

// tourschema.post(/^find/, function (doc , next) {
//     console.log(`query takes ${Date.now() - this.start} milliseconds`);
//     next(); 
// })
// Aggregation middleware
// tourschema.pre('aggregate', function (next) {
//     this._pipeline.unshift({ $match: { secretTour: { $ne: true } } });
//     next();
// })
const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;