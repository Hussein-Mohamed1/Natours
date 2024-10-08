const Review = require('../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const factory = require('./handlerFactory')


exports.setTourUserIds = catchAsync(async (req, res, next) => {
    req.body.user = req.user._id;
    if (!req.body.tour) req.body.tour = req.params.tourId;
    next();
})

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review)
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);