const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const factory = require('./handlerFactory')
const fs = require('fs')
// const multerStorage = multer.diskStorage({
//     destination: (req , file , cb) => {
//         cb(null , 'starter/public/img/users')
//     },
//     filename: (req , file , cb) => {
//         const extension = file.mimetype.split('/')[1];
//         cb(null , `user-${req.user._id}-${Date.now()}.${extension}`);
//     }
// })
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image'))
        cb(null, true);
    else
        cb(new appError('Not an image! Please upload only images.', 400), false)
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
const filterObj = (obj, ...allowedfields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedfields.includes(key)) newObj[key] = obj[key];
    })
    return newObj;
}
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`starter/public/img/users/${req.file.filename}`)
    next();
})
const deletePhotoFromServer = async photo => {
    const path = `${__dirname}../public/img/users/${photo}`;
    await fs.unlink(path, err => {
        if (err) return console.log(err);
        console.log('Previous photo has been deleted');
    });
};
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) return next(new appError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
    ));
    const filterdBody = filterObj(req.body, 'email', 'name');
    if (req.file) {
        filterdBody.photo = req.file.filename;
        await deletePhotoFromServer(req.user.photo)
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterdBody, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
})
exports.createUser = factory.createOne(User)
exports.getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
}
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User)
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User)
