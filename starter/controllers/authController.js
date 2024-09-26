const User = require('./../models/userModel');
const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Email = require('./../utils/email');


const getToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.
            JWT_EXPIRES_IN
    })
}
const createSendToken = (user, statuscode, res) => {
    const token = getToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined;
    res.status(statuscode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangeAt: req.body.passwordChangeAt,
        role: req.body.role
    })
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendwelcome();
    createSendToken(newUser, 201, res);
})
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new appError('Please provide email and password!', 400));
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.checkPassword(password))) return next(new appError('Incorrect email or password', 401))
    createSendToken(user, 200, res);
})
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError('You are not logged in! Please log in to get access.', 401));
    }
    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new appError(
            'The user belonging to this token does no longer exist.',
            401
        ))
    }
    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError('User recently changed password! Please log in again.', 401))
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
})

exports.isLogedIn = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // Verification token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            // Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next()
            }
            // Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next()
            }
            res.locals.user = currentUser;
        } catch (e) {
            return next();
        }
    }
    next();
})

exports.logOut = (req, res) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    res.status(200).json({ status: 'success' });
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError('You do not have permission to perform this action', 403));
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError('There is no user with email address.', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    try {
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/users/resetPassword/${resetToken}`;
        await new Email(user , resetURL).sendPasswordReset();
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
    } catch (err) {
        // console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError('There was an error sending the email. Try again later!'),
            500
        )
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return next(new appError('Token is invalid or has expired', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.checkPassword(req.body.passwordCurrent))) return next(new appError('Your current password is wrong.', 401));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
})