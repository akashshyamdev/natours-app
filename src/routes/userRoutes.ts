import { Router } from 'express';
import { forgotPassword, login, signup, resetPassword, updatePassword } from './../controllers/authController';
import { createUser, deleteMe, deleteUser, getAllUsers, getUser, updateMe, updateUser } from '../controllers/userController';
import protectMiddleware from '../middleware/protectMiddleware';

const router = Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);

router.route('/update-my-password').patch(protectMiddleware, updatePassword);
router.route('/update-me').patch(protectMiddleware, updateMe);
router.route('/delete-me').delete(protectMiddleware, deleteMe);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
