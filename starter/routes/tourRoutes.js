const express = require('express');
const tourControllers = require('../controllers/tourController');
const authControllers = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const tourRouter = express.Router();
tourRouter.route('/tour-stats').get(tourControllers.getTourStats);
tourRouter.route('/top-5-cheap').get(tourControllers.aliasTopTours, tourControllers.getAllTours);
tourRouter
    .route('/monthly-plan/:year')
    .get(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide', 'guide'),
        tourControllers.getMonthlyplan
    );
tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourControllers.getTourWithin)
tourRouter.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances)
tourRouter.route('/').get(tourControllers.getAllTours)
    .post(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide'),
        tourControllers.createTour
    );
tourRouter.route('/:id').get(tourControllers.getTour)
    .patch(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide'),
        tourControllers.uploadTourImages,
        tourControllers.resizeTourImages,
        tourControllers.updateTour
    )
    .delete(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide'),
        tourControllers.deleteTour
    );

// tourRouter.route('/:tourId/reviews').post(authControllers.protect , authControllers.restrictTo('user') , reviewControllers.createReview)
tourRouter.use('/:tourId/reviews', reviewRouter);
module.exports = tourRouter;