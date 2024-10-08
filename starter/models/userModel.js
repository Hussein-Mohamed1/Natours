const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tourModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    }
    next();
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangeAt = Date.now() - 1000;
    next();
})
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
})
userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.changedPasswordAfter = function (jwtTime) {
    if (this.passwordChangeAt) {
        const changedTime = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        return changedTime > jwtTime;
    }
    return false;
}
userSchema.methods.createPasswordResetToken = function () {
    const restToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(restToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return restToken;
}
const User = mongoose.model('User', userSchema);
module.exports = User;