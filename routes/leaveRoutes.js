import express from 'express';
import { createLeaveRequest, getLeaveRequests, getLeaveBalance } from '../controllers/leaveController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const leaveRouter = express.Router();

leaveRouter.post('/request', authMiddleware, createLeaveRequest);
leaveRouter.get('/requests', authMiddleware, getLeaveRequests);
leaveRouter.get('/balance', authMiddleware, getLeaveBalance);

export default leaveRouter;