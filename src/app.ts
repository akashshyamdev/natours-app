import express from 'express';
import morgan from 'morgan';
import globalErrorHandler from './controllers/errorController';
import tourRoutes from './routes/tourRoutes';
import userRoutes from './routes/userRoutes';
import AppError from './utils/AppError';

// Initiating the app
const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
