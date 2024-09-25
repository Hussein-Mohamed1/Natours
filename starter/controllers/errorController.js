const { stack } = require("../routes/tourRoutes");
const appError = require("../utils/appError");
const handleCastErrorDB = err => {
    return new appError(`Invalid ${err.path}: ${err.value}.`, 400)
}
const handleDuplicateFieldsDB = err => {
    return new appError(`Duplicate field value: ${err.keyValue.name}. Please use another value!`, 400)
}
const handleValidationErrorDB = err => {
    let message = Object.values(err.errors).map(ele => ele.message)
    message = `Invalid input data. ${message.join('. ')}`
    return new appError(message, 400);
}
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        console.error('ERROR 💥', err);
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        } else {

            console.error('ERROR 💥', err);

            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    } else {
        if (err.isOperational) {
            res.status(err.statusCode).render('error', {
                title: 'Something went wrong!',
                msg: err.message
            })
        } else {

            console.error('ERROR 💥', err);

            res.status(500).render( 'error', {
                title: 'Something went wrong!',
                msg: 'Please try again later'
            });
        }
    }
}
// handel for user 
const handleJWTError = () => new appError('Invalid token. Please log in again!', 401);
handleJWTExpiredError = () => new appError('Your token has expired! Please log in again.', 401)
module.exports = (err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError')
            error = handleCastErrorDB(error);
        if (err.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (err.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
    else if (process.env.NODE_ENV === "development")
        sendErrorDev(err, req, res);
}