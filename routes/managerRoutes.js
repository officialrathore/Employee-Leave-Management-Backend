import express from "express";
import {getAllLeaveRequests,updateLeaveStatus,getAllEmployees,getManagerCalendarLeaves} from "../controllers/managerController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const managerRouter = express.Router();

managerRouter.get("/requests", authMiddleware, roleMiddleware("manager"), getAllLeaveRequests);
managerRouter.put("/requests/:id", authMiddleware, roleMiddleware("manager"), updateLeaveStatus);
managerRouter.get("/employees", authMiddleware, roleMiddleware("manager"), getAllEmployees);
managerRouter.get("/leave-calendar", authMiddleware, roleMiddleware("manager"), getManagerCalendarLeaves);

export default managerRouter;
