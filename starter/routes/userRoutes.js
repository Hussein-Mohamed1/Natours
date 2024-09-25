const express = require('express');
const userRouter = express.Router();
const userControllers = require('../controllers/userController');
const authController = require('../controllers/authController');

userRouter.post('/signup' , authController.signup );
userRouter.post('/login' , authController.login );
userRouter.get('/logout' , authController.logOut );
userRouter.post('/forgotpassword' , authController.forgotPassword);
userRouter.patch('/resetpassword/:token' , authController.resetPassword);

userRouter.use(authController.protect)
userRouter.patch('/updateMyPassword' ,authController.updatePassword);
userRouter.patch('/updateMe' , userControllers.uploadUserPhoto , userControllers.resizeUserPhoto  , userControllers.updateMe);
userRouter.delete('/deleteMe' ,  userControllers.deleteMe);
userRouter.get('/me' ,  userControllers.getMe , userControllers.getUser);

userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(userControllers.getAllUsers).post(userControllers.createUser);
userRouter.route('/:id').get(userControllers.getUser).patch(userControllers.updateUser).delete(userControllers.deleteUser);

module.exports = userRouter;