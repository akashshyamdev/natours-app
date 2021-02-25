import { Router } from 'express';
import protectMiddleware from '../middleware/protectMiddleware';
import { createTour, deleteTour, getAllTours, getMonthlyPlans, getTour, getTourStats, updateTour } from '../controllers/tourController';
import restrictMiddleware from '../middleware/restrictMiddleware';

const router = Router();

router.route('/get-tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlans);

router.route('/').get(getAllTours).post(createTour);

router
	.route('/:id')
	.get(getTour)
	.patch(updateTour) // @ts-ignore
	.delete(protectMiddleware, restrictMiddleware(['admin']), deleteTour);

export default router;
