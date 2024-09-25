const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc)
            return next(new appError('No document found with that id', 404));
        res.status(204).json({
            status: 'success',
            data: null
        })
    })

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true
    })
    if (!doc)
        return next(new appError('No document found with that id', 404));
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const newdoc = await Model.create(req.body);
    res.status(201).json({
        satus: 'success',
        data: {
            data: newdoc
        }
    })
})

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // calling features
    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().pagination();
    const docs = await features.query
    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
            data: docs
        }
    })
})

exports.getOne = (Model, popOption) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query // Tour.findOne({'_id' : req.params.id});
    if (!doc)
        return next(new appError('No document found with that id', 404));
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })

})