const express = require('express');
const path = require('path');
const { rateLimit } = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cookieparser = require('cookie-parser');
const hpp = require('hpp');
const morgan = require('morgan');
const appError = require('./starter/utils/appError')
const globalErrorHandler = require('./starter/controllers/errorController');
const app = express();

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'starter/views'));


// 1) MiddleWare
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieparser());
const Limiter = rateLimit({
    limit: 200,
    windowMs: 60 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', Limiter);
app.use(express.static(path.join(__dirname, 'starter/public')))
app.use(express.static(path.join(__dirname, 'starter/public/js')))
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})
app.use(mongoSanitize());
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));



// ######################################################################

const scriptSrcUrls = ['https://unpkg.com/',
    'https://tile.openstreetmap.org'];
const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/'
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

//set security http headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
            fontSrc: ["'self'", ...fontSrcUrls]
        }
    })
);




// ######################################################################

const tourRouter = require('./starter/routes/tourRoutes')
const userRouter = require('./starter/routes/userRoutes')
const reviewRouter = require('./starter/routes/reviewRoutes')
const viewRouter = require('./starter/routes/viewRoutes');
const cookieParser = require('cookie-parser');


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.statusCode = 404;
    // err.status = 'fail';
    next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler);

module.exports = app;




