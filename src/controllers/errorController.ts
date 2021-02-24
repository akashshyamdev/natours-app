import AppError from '../utils/AppError';
import { MongoError } from 'mongodb';
import { CastError } from 'mongoose';
import { Response, Request, NextFunction } from 'express';
import { findKey } from 'lodash';

type keyName = { [key: string]: any };
type keyPattern = { [key: string]: any };

interface IError extends Error {
	statusCode: number;
	status: string;
	isOperational: boolean;
	code?: string;
	keyName?: keyName;
	keyPattern?: keyPattern;
}

interface ICastError extends CastError {
	statusCode: number;
	status: string;
	isOperational: boolean;
}

interface IMongoError extends MongoError {
	keyPattern?: object;
	errors: {
		[key: string]: {
			message: string;
			name: string;
		};
	};
}

function handleCastErrorDB(err: ICastError) {
	const message = `Invalid error ${err.path} is ${err.value}`;
	return new AppError(message, 400);
}

function handleValidationErrorDB(err: IMongoError) {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err: IMongoError) {
	const message = `Duplicate field value. Please use another value`;
	return new AppError(message, 400);
}

export default function globalErrorHandler(err: IError, req: Request, res: Response, next: NextFunction): void {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			stack: err.stack,
			error: err,
		});
	} else if (process.env.NODE_ENV === 'production') {
		let error: any = { ...err };

		if ((error.name = 'CastError')) error = handleCastErrorDB(error as ICastError);

		if (error.isOperational) {
			res.status(error.statusCode).json({
				status: error.status,
				message: error.message,
			});
		} else {
			console.error('Error 💣 💣 💥 💥');
			console.error(error);

			res.status(500).json({
				status: 'error',
				message: 'An unexpected error ocurred',
			});
		}
	}
}
