  import LeaveRequest from "../models/LeaveRequest.js";
  import User from "../models/User.js";

export const createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user.id;

    const s = new Date(startDate);
    const e = new Date(endDate);

    if (!leaveType || !startDate || !endDate || s > e) {
      return res.status(400).json({ message: "Invalid leave data" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (s < today || e < today) {
      return res.status(400).json({ message: "Past dates not allowed" });
    }

    const requestedDays =
      Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;

    const overlap = await LeaveRequest.findOne({
      employee: employeeId,
      status: { $in: ["pending", "approved"] },
      startDate: { $lte: e },
      endDate: { $gte: s },
    });

    if (overlap) {
      return res.status(400).json({
        message: "You already have a leave in this date range",
      });
    }

    const DEFAULT_ALLOC = { sick: 7, casual: 8, paid: 3, vacation: 2 };

    const used = await LeaveRequest.aggregate([
      {
        $match: {
          employee: employeeId,
          leaveType,
          status: { $in: ["approved", "pending"] },
        },
      },
      {
        $group: {
          _id: null,
          days: {
            $sum: {
              $add: [
                {
                  $dateDiff: {
                    startDate: "$startDate",
                    endDate: "$endDate",
                    unit: "day",
                  },
                },
                1,
              ],
            },
          },
        },
      },
    ]);

    const usedDays = used[0]?.days || 0;
    const available = DEFAULT_ALLOC[leaveType] - usedDays;

    if (requestedDays > available) {
      return res.status(400).json({
        message: `Only ${available} ${leaveType} leave days available`,
      });
    }

    const leave = new LeaveRequest({
      employee: employeeId,
      leaveType,
      startDate: s,
      endDate: e,
      reason,
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

  export const getLeaveRequests = async (req, res) => {
    try {
      const leaveRequests = await LeaveRequest.find({employee: req.user.id}).sort({ createdAt: -1 });
      res.status(200).json(leaveRequests);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  export const getLeaveBalance = async (req, res) => {
    try {
      const employeeId = req.user.id;

      const employee = await User.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "User not found" });
      }

      const DEFAULT_ALLOC = { sick: 7, casual: 8, paid: 3, vacation: 2,};
      const types = ['sick','casual','paid','vacation'];
      const perType = {};
      let totalDays = 0;
      let totalUsed = 0;
      let totalPending = 0;

      for (const t of types) {
        const totalForType = DEFAULT_ALLOC[t] || 0;

        const approved = await LeaveRequest.aggregate([
          { $match: { employee: employee._id, status: 'approved', leaveType: t } },
          {
            $group: {
              _id: null,
              totalDays: {
                $sum: { $add: [ { $dateDiff: { startDate: '$startDate', endDate: '$endDate', unit: 'day' } }, 1 ] }
              }
            }
          }
        ]);
        const usedForType = approved[0]?.totalDays || 0;

        const pending = await LeaveRequest.aggregate([
          { $match: { employee: employee._id, status: 'pending', leaveType: t } },
          {
            $group: {
              _id: null,
              totalDays: {
                $sum: { $add: [ { $dateDiff: { startDate: '$startDate', endDate: '$endDate', unit: 'day' } }, 1 ] }
              }
            }
          }
        ]);
        const pendingForType = pending[0]?.totalDays || 0;

        const remainingForType = totalForType - usedForType;

        perType[t] = {
          total: totalForType,
          used: usedForType,
          pending: pendingForType,
          remaining: Math.max(0, remainingForType),
          available: Math.max(0, remainingForType - pendingForType)
        };

        totalDays += totalForType;
        totalUsed += usedForType;
        totalPending += pendingForType;
      }

      res.status(200).json({
        totalDays,
        usedDays: totalUsed,
        pendingDays: totalPending,
        remainingDays: totalDays - totalUsed,
        available: (totalDays - totalUsed) - totalPending,
        perType
      });
    } catch (error) {
      console.error("LEAVE BALANCE ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


