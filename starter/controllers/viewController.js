const catchAsync = require('./../utils/catchAsync');
const Tour = require('../models/tourModel')
const appError = require('./../utils/appError');
const User = require('./../models/userModel');
exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find()
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('overview', {
        title: "All Tours",
        tours
    });
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    if (!tour) return next(new appError('There is no tour with that name.', 404));

    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
})

exports.signUp = (req, res, next) => {
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('signUp', {
        title: 'Create your account!',
    });
}
exports.logIn = (req, res, next) => {
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('login', {
        title: 'Log into your account',
    });
}
exports.userAcount = (req, res, next) => {
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('userAcount', {
        title: 'Yout Acount',
    });
}

exports.updateData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    })
    res.status(200).render('userAcount', {
        title: 'Your Acount',
        user: updatedUser
    })
})