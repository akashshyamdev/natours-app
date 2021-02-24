import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import APIFeatures from '../utils/APIFeatures';
import { Tour } from '../models/tourModel';
import AppError from '../utils/AppError';

export const getAllTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
	const tours = await features.query;

	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours,
		},
	});
});

export const getTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const tour = await Tour.findById(req.params.id);

	if (!tour) {
		return next(new AppError('No tour found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			tour,
		},
	});
});

export const createTour = catchAsync(async (req: Request, res: Response) => {
	const newTour = await Tour.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			tour: newTour,
		},
	});
});

export const updateTour = catchAsync(async (req: Request, res: Response) => {
	const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

	res.status(200).json({
		status: 'success',
		data: {
			tour: updatedTour,
		},
	});
});

export const deleteTour = catchAsync(async (req: Request, res: Response) => {
	await Tour.findByIdAndDelete(req.params.id);

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

export const getTourStats = catchAsync(async (req: Request, res: Response) => {
	const stats = await Tour.aggregate([
		{
			$match: {
				ratingsAverage: { $gte: 4.5 },
			},
		},
		{
			$group: {
				_id: '$difficulty',
				numTours: { $sum: 1 },
				numRatings: { $sum: '$ratingsQuantity' },
				avgRating: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' },
			},
		},
		{
			$sort: { avgPrice: 1 },
		},
	]);

	res.status(200).json({
		status: 'success',
		data: {
			stats,
		},
	});
});

export const getMonthlyPlans = catchAsync(async (req: Request, res: Response) => {
	const year = parseInt(req.params.year);

	const plan = await Tour.aggregate([
		{
			$unwind: '$startDates',
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: '$startDates' },
				numTours: { $sum: 1 },
				tours: { $push: { name: '$name', price: '$price' } },
			},
		},
		{
			$addFields: {
				month: '$_id',
			},
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: { numTours: -1 },
		},
	]);

	res.status(200).json({
		status: 'success',
		data: {
			plan,
		},
	});
});
