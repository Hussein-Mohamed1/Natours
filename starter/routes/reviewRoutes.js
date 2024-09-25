const express = require('express');
const reviewControllers = require('./../controllers/reviewController');
const authControllers = require('../controllers/authController');
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authControllers.protect)

reviewRouter.route('/').get(reviewControllers.getAllReviews)
    .post(
        authControllers.restrictTo('user'),
        reviewControllers.setTourUserIds,
        reviewControllers.createReview);

reviewRouter.route('/:id')
    .delete(authControllers.restrictTo('user', 'admin'), reviewControllers.deleteReview)
    .patch( authControllers.restrictTo('user', 'admin') , reviewControllers.updateReview)
    .get(reviewControllers.getReview)

module.exports = reviewRouter;