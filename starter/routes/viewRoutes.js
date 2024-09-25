const express = require('express');
const viewControllers = require('../controllers/viewController');
const authController = require('../controllers/authController');
const viewRouter = express.Router();

viewRouter.get('/', authController.isLogedIn , viewControllers.getOverview  )
viewRouter.get('/tour/:slug' , authController.isLogedIn , viewControllers.getTour )
viewRouter.get('/signUp', viewControllers.signUp );
viewRouter.get('/login', authController.isLogedIn , viewControllers.logIn )
viewRouter.get('/me', authController.protect , viewControllers.userAcount )
viewRouter.post('/submit-user-data' , authController.protect , viewControllers.updateData)
module.exports = viewRouter;