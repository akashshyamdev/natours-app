import { User } from './../models/userModel';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import APIFeatures from '../utils/APIFeatures';
import AppError from '../utils/AppError';
import { pick } from 'lodash';

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const users = await User.find();

	res.status(200).json({
		status: 'success',
		results: users.length,
		data: {
			users,
		},
	});
});

export function getUser(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}

export function createUser(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}

export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError('This route is not for password updates. Please use /update-my-password', 403));
	}

	const filteredBody = pick(req.body, ['name', 'email']);
	const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, { new: true, runValidators: true });

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

export function updateUser(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}

export const deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	await User.findByIdAndUpdate(req.user._id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

export function deleteUser(_req: Request, res: Response) {
	res.status(501).json({
		status: 'error',
		message: 'Not implemented',
	});
}
