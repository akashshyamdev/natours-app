import { model, Schema, Document, Query } from 'mongoose';
import validator from 'validator';
import slugify from 'slugify';

export interface ITourSimple extends Document {
	id: string;
	name: string;
	duration: number;
	maxGroupSize: number;
	difficulty: string;
	ratingsAverage: number;
	ratingsQuantity: number;
	price: number;
	summary: string;
	description: string;
	imageCover: string;
	images: [string];
	startDates: [string];
	slug?: string;
}

const tourSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			maxLength: [40, 'The tour name must have less or equal length than 40 characters'],
			minLength: [7, 'The tour name must have more or equal length than 10 characters'],
		},
		slug: String,
		difficulty: {
			type: String,
			required: [true, 'A tour must have a difficulty'],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Difficulty must be either easy, medium or difficult',
			},
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
			min: [0, 'The rating must be between 0 and 5'],
			max: [5, 'The rating must be between 0 and 5'],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		rating: {
			type: Number,
			min: [0, 'The rating must be between 0 and 5'],
			max: [5, 'The rating must be between 0 and 5'],
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price'],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (val: number): boolean {
					// @ts-ignore
					return val < this.price;
				},
				message: 'Discount({VALUE}) should be less than regular price',
			},
		},
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
		// TODO: Implement subscriber plants
		isPremium: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	}
);

// Document virtual properties
tourSchema.virtual('durationWeeks').get(function (this: ITourSimple) {
	return Math.floor(this.duration / 7);
});

// Document middleware
tourSchema.pre('save', function (this: ITourSimple, next) {
	this.slug = slugify(this.name, { lower: true });

	next();
});

// Query middleware
tourSchema.pre(/^find/, function (next) {
	// @ts-ignore
	this.find({ isPremium: { $ne: true } });

	next(null);
});

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {
	// @ts-ignore
	this.pipeline().unshift({ $match: { isPremium: { $ne: true } } });

	next(null);
});

export const Tour = model<ITourSimple>('Tour', tourSchema);
