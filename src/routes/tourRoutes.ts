import { Router } from 'express';
import { createTour, deleteTour, getAllTours, getMonthlyPlans, getTour, getTourStats, updateTour } from '../controllers/tourController';

const router = Router();

router.route('/get-tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlans);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
