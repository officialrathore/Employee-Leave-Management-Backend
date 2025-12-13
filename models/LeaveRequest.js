import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: { type: String, enum: ['sick', 'casual', 'paid', 'vacation'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  managerComment: { type: String }
}, { timestamps: true });

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequest;
