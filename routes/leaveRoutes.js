import express from 'express';
import { createLeaveRequest, getLeaveRequests, getLeaveBalance } from '../controllers/leaveController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const leaveRouter = express.Router();

leaveRouter.post('/request', authMiddleware,roleMiddleware("employee"), createLeaveRequest);
leaveRouter.get('/requests', authMiddleware, roleMiddleware("employee"), getLeaveRequests);
leaveRouter.get('/balance', authMiddleware, roleMiddleware("employee"), getLeaveBalance);

export default leaveRouter;