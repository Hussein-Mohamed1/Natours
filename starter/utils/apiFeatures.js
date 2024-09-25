class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    filter() {
        // 1A) Filter
        const queryObj = { ...this.queryStr };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);
        // 1B) Advanced Filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        // 2) sorting
        if (this.queryStr.sort) {
            const sortStr = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortStr);
        } else {
            // this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields() {
        // 3) limit fields
        if (this.queryStr.fields) {
            const selected = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(selected);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    pagination() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
module.exports = APIFeatures;