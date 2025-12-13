import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";

export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("employee", "name email role leaveBalances")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, managerComment } = req.body;

    const leave = await LeaveRequest.findById(id).populate("employee");

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Leave request already processed" });
    }

    // Calculate requested days
    const requestedDays = Math.round(
      (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;

    if (requestedDays <= 0) {
      return res.status(400).json({ message: "Invalid leave duration" });
    }

    if (action === "approve") {
      const user = await User.findById(leave.employee._id);

      const PAID_TYPES = ["sick", "casual", "paid", "vacation"];

      if (PAID_TYPES.includes(leave.leaveType)) {
        const currentBalance = user.leaveBalances[leave.leaveType] || 0;

        if (requestedDays > currentBalance) {
          return res.status(400).json({
            message: `Cannot approve ${requestedDays} days. Only ${currentBalance} days available for ${leave.leaveType} leave.`,
          });
        }

        // Deduct requested days safely
        user.leaveBalances[leave.leaveType] = currentBalance - requestedDays;
        await user.save();
      }

      leave.status = "approved";
    } 
    else if (action === "reject") {
      leave.status = "rejected";
    } 
    else {
      return res.status(400).json({ message: "Action must be approve or reject" });
    }

    leave.managerComment = managerComment || "";
    await leave.save();

    res.json({ leave });
  } catch (error) {
    console.error("UPDATE LEAVE STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
      const employees = await User.find({ role: "employee" }).select("name email leaveBalance leaveBalances");
      res.json(employees);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
};

export const getManagerCalendarLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("employee", "name email")
      .select("startDate endDate leaveType status reason employee");

    const calendarData = leaves.map((l) => ({
      id: l._id,
      title: `${l.employee.name} (${l.leaveType})`,
      start: l.startDate,
      end: new Date(new Date(l.endDate).setDate(l.endDate.getDate() + 1)),
      status: l.status,
      employee: l.employee.name,
      reason: l.reason,
    }));

    res.json(calendarData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};