import mongoose from "mongoose";

// In-memory fallback fallback store in case MongoDB is not connected yet
// ensures the preview/development environment never crashes and works instantly out-of-the-box.
export const fallbackStore = {
  users: [
    {
      id: "demo-user",
      email: "student@internforge.com",
      password: "password123",
      name: "Arjun Singh",
      college: "BITS Pilani",
      level: 14,
      xp: 14250,
      streak: 12,
      completedNodes: ["w1-2"],
      activeNodeId: "w3-5",
      badges: ["b1", "b2", "b3"],
      labsCompleted: 14,
      purchasedPrograms: [] as string[]
    },
    {
      id: "admin-user-2-mem",
      email: "assistant.admin@internforge.com",
      password: "adminforgepass",
      name: "Assistant Administrator",
      college: "InternForge HQ Office",
      level: 99,
      xp: 99999,
      streak: 99,
      completedNodes: [],
      activeNodeId: "",
      badges: ["b1", "b2", "b3"],
      labsCompleted: 99,
      purchasedPrograms: [] as string[]
    }
  ],
  profileRequests: [
    {
      id: "req-1",
      userId: "demo-user",
      userEmail: "student@internforge.com",
      currentName: "Arjun Singh",
      currentCollege: "BITS Pilani",
      requestedName: "Arjun Kumar Singh",
      requestedCollege: "BITS Pilani (Rajasthan Campus)",
      status: "pending",
      createdAt: new Date().toISOString()
    }
  ] as any[],
  loginAudits: [
    {
      id: "audit-1",
      email: "student@internforge.com",
      name: "Arjun Singh",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      provider: "credentials"
    }
  ] as any[],
  transactions: [
    {
      id: "txn-1",
      userId: "demo-user",
      userEmail: "student@internforge.com",
      userName: "Arjun Singh",
      programId: "prog-fullstack",
      programTitle: "Full-Stack Devops Cohort [Next.js + AWS]",
      amount: 14999,
      status: "success",
      paymentGateway: "PhonePe",
      timestamp: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: "txn-2",
      userId: "demo-user",
      userEmail: "student@internforge.com",
      userName: "Arjun Singh",
      programId: "prog-quant",
      programTitle: "High-Performance Quantitative Systems [Rust/C++]",
      amount: 18450,
      status: "failed",
      paymentGateway: "Cashfree",
      errorMessage: "Insufficient funds / Bank API timeout",
      timestamp: new Date(Date.now() - 14400000).toISOString()
    },
    {
      id: "txn-3",
      userId: "demo-user",
      userEmail: "student@internforge.com",
      userName: "Arjun Singh",
      programId: "prog-cyber",
      programTitle: "Cybersecurity Red-Teaming & ISO 27001",
      amount: 12500,
      status: "failed",
      paymentGateway: "PhonePe",
      errorMessage: "UPI PIN validation limit exceeded",
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "txn-4",
      userId: "demo-user",
      userEmail: "student@internforge.com",
      userName: "Arjun Singh",
      programId: "prog-fullstack",
      programTitle: "Full-Stack Devops Cohort [Next.js + AWS]",
      amount: 14999,
      status: "success",
      paymentGateway: "Cashfree",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ] as any[]
};

const MONGODB_URI = process.env.MONGODB_URI || "";
export let isMongoConnected = false;

export async function connectToDatabase() {
  if (MONGODB_URI) {
    console.log("Found MONGODB_URI. Attempting database connection...");
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("Successfully connected to MongoDB backend!");
      isMongoConnected = true;
    } catch (err: any) {
      console.error("Mongoose connection warning (falling back to memory state):", err.message);
    }
  } else {
    console.log("No MONGODB_URI found in environment variables. Running in-memory schema fallback.");
  }
}
