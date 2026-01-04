import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.googleId; } },
    googleId: { type: String, unique: true, sparse: true }, 
    role: { type: String, enum: ["employee", "manager", "admin"], default: "employee" },
    leaveBalance: { type: Number, default: 20 },
    leaveBalances: {
      sick: { type: Number, default: 7 },
      casual: { type: Number, default: 8 },
      paid: { type: Number, default: 3 },
      vacation: { type: Number, default: 2 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
