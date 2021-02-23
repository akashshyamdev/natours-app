"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = void 0;
const mongoose_1 = require("mongoose");
const tourSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary'],
    },
    description: {
        type: String,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
}, {
    timestamps: true,
});
exports.Tour = mongoose_1.model('Tour', tourSchema);
//# sourceMappingURL=tourModel.js.map