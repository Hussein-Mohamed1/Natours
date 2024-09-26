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

const filterObj = (obj, ...allowedfields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedfields.includes(key)) newObj[key] = obj[key];
    })
    return newObj;
}


//################################################################

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'users',
        format: async (req, file) => 'jpeg', // or 'png'
        public_id: (req, file) => `user-${req.user._id}-${Date.now()}`, // Set filename dynamically
        transformation: [
            {
                width: 500,
                height: 500,
                crop: 'fill', // Use 'fill' to ensure the image covers the dimensions
                quality: 90 // Set the quality
            }
        ]
    },
});

// Multer upload setup
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new appError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: multerFilter
}); 

exports.uploadUserPhoto = upload.single('photo');

// No need to resize as Cloudinary handles it
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next(); // If no file is uploaded
    req.file.filename = req.file.path; // Use the Cloudinary URL
    next();
});

// Update user photo in the database
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }

    // Filter fields (only allow name and email)
    const filteredBody = filterObj(req.body, 'email', 'name');

    // Add Cloudinary URL if photo was uploaded
    if (req.file) {
        filteredBody.photo = req.file.path; // Cloudinary file URL
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});


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
