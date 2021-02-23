import { Request, Response } from 'express';
import APIFeatures from '../utils/APIFeatures';
import { Tour } from '../models/tourModel';

export async function getAllTours(req: Request, res: Response) {
	try {
		const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
		const tours = await features.query;

		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: {
				tours,
			},
		});
	} catch (error) {
		res.status(404).json({
			status: 'success',
			message: error.message,
		});
	}
}

export async function getTourStats(_req: Request, res: Response) {
	try {
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
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

export async function getMonthlyPlans(req: Request, res: Response) {
	try {
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
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

export async function getTour(req: Request, res: Response) {
	try {
		const tour = await Tour.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(404).json({
			status: 'success',
			message: error,
		});
	}
}

export async function createTour(req: Request, res: Response) {
	try {
		const newTour = await Tour.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour,
			},
		});
	} catch ({ message }) {
		res.status(400).json({
			status: 'error',
			message,
		});
	}
}

export async function updateTour(req: Request, res: Response) {
	try {
		const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

		res.status(200).json({
			status: 'success',
			data: {
				tour: updatedTour,
			},
		});
	} catch ({ message }) {
		res.status(400).json({
			status: 'error',
			message,
		});
	}
}

export async function deleteTour(req: Request, res: Response) {
	try {
		await Tour.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch ({ message }) {
		res.status(400).json({
			status: 'error',
			message,
		});
	}
}
