import express from 'express';
import morgan from 'morgan';
import tourRoutes from './routes/tourRoutes';
import userRoutes from './routes/userRoutes';

// Initiating the app
const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', () => {
	//
});

export default app;
