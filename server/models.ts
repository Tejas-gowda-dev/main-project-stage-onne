import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  college: { type: String, default: "BITS Pilani" },
  level: { type: Number, default: 14 },
  xp: { type: Number, default: 14250 },
  streak: { type: Number, default: 12 },
  completedNodes: { type: [String], default: ["w1-2"] },
  activeNodeId: { type: String, default: "w3-5" },
  badges: { type: [String], default: ["b1", "b2", "b3"] },
  labsCompleted: { type: Number, default: 14 },
  purchasedPrograms: { type: [String], default: [] }
}, { timestamps: true });

const ProfileRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  currentName: { type: String },
  currentCollege: { type: String },
  requestedName: { type: String },
  requestedCollege: { type: String },
  status: { type: String, default: "pending" } // pending, approved, rejected
}, { timestamps: true });

const LoginAuditSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  timestamp: { type: Date, default: Date.now },
  provider: { type: String, default: "credentials" }
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  programId: { type: String, required: true },
  programTitle: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true }, // "success" or "failed"
  paymentGateway: { type: String, required: true }, // "PhonePe" or "Cashfree" or other
  errorMessage: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = (mongoose.models.User || mongoose.model("User", UserSchema)) as any;
export const ProfileRequest = (mongoose.models.ProfileRequest || mongoose.model("ProfileRequest", ProfileRequestSchema)) as any;
export const LoginAudit = (mongoose.models.LoginAudit || mongoose.model("LoginAudit", LoginAuditSchema)) as any;
export const Transaction = (mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema)) as any;
