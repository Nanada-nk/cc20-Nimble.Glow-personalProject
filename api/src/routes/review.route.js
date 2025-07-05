import express from 'express';
import authenticateUser from '../middlewares/authenticate.middleware.js';
import checkRole from '../middlewares/checkRole.middleware.js';
import reviewController from '../controllers/review.controller.js';
import upload from '../middlewares/upload.middleware.js'

const reviewRouter = express.Router();

reviewRouter.get('/product/:productId', reviewController.getByProduct);
reviewRouter.post('/product/:productId', authenticateUser, checkRole("CUSTOMER"), upload.array('images', 5), reviewController.create);
reviewRouter.patch('/:reviewId', authenticateUser, checkRole("CUSTOMER"),upload.array('images', 5), reviewController.update);
reviewRouter.delete('/:reviewId', authenticateUser, checkRole("CUSTOMER"), reviewController.delete);

export default reviewRouter;