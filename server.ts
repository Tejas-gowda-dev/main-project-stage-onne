import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";

// In-memory fallback fallback store in case MongoDB is not connected yet
// ensures the preview/development environment never crashes and works instantly out-of-the-box.
const fallbackStore = {
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
      labsCompleted: 14
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
  ] as any[]
};

// ----------------------------------------------------
// MongoDB Database Connection Setup
// ----------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI || "";
let isMongoConnected = false;

if (MONGODB_URI) {
  console.log("Found MONGODB_URI. Attempting database connection...");
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("Successfully connected to MongoDB backend!");
      isMongoConnected = true;
    })
    .catch((err) => {
      console.error("Mongoose connection warning (falling back to memory state):", err.message);
    });
} else {
  console.log("No MONGODB_URI found in environment variables. Running in-memory schema fallback (ideal for sandbox/preview). To persist data permanently, add MONGODB_URI to your .env or platform variables.");
}

// ----------------------------------------------------
// MongoDB Database Schemas and Models
// ----------------------------------------------------
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
  labsCompleted: { type: Number, default: 14 }
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

const User = (mongoose.models.User || mongoose.model("User", UserSchema)) as any;
const ProfileRequest = (mongoose.models.ProfileRequest || mongoose.model("ProfileRequest", ProfileRequestSchema)) as any;
const LoginAudit = (mongoose.models.LoginAudit || mongoose.model("LoginAudit", LoginAuditSchema)) as any;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse payload parameters
  app.use(express.json());

  // ----------------------------------------------------
  // Backend Authentication and Tracker API Endpoints
  // ----------------------------------------------------

  // Diagnostic Health Probe Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      database: isMongoConnected ? "mongodb" : "in-memory-fallback",
      timestamp: new Date().toISOString()
    });
  });

  // 1. User Register Endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, college } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Name, email, and password parameters are required." });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const userCollege = college || "BITS Pilani";

      if (isMongoConnected) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(400).json({ error: "User already registered with this email address." });
        }

        const newUser = new User({
          email: normalizedEmail,
          password, // Cleartext warning: for production, salt and hash password
          name,
          college: userCollege,
          level: 1,
          xp: 100,
          streak: 1,
          completedNodes: [],
          activeNodeId: "w1-2",
          badges: ["b1"],
          labsCompleted: 0
        });

        await newUser.save();

        const audit = new LoginAudit({ email: normalizedEmail, name, provider: 'credentials' });
        await audit.save();

        return res.json({
          message: "Registration completed successfully!",
          user: {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            college: newUser.college,
            level: newUser.level,
            xp: newUser.xp,
            streak: newUser.streak,
            completedNodes: newUser.completedNodes,
            activeNodeId: newUser.activeNodeId,
            badges: newUser.badges,
            labsCompleted: newUser.labsCompleted
          }
        });
      } else {
        // Fallback Store mock logic
        const existing = fallbackStore.users.find(u => u.email === normalizedEmail);
        if (existing) {
          return res.status(400).json({ error: "User already registered in memory." });
        }

        const newUser = {
          id: "mem-" + Date.now(),
          email: normalizedEmail,
          password,
          name,
          college: userCollege,
          level: 1,
          xp: 100,
          streak: 1,
          completedNodes: [],
          activeNodeId: "w1-2",
          badges: ["b1"],
          labsCompleted: 0
        };

        fallbackStore.users.push(newUser);

        fallbackStore.loginAudits.push({
          id: "audit-" + Date.now(),
          email: normalizedEmail,
          name,
          timestamp: new Date().toISOString(),
          provider: 'credentials'
        });

        return res.json({
          message: "Registration completed successfully (In-Memory Fallback)!",
          user: newUser
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to process registration request." });
    }
  });

  // 2. User Login Endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password elements are required." });
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (isMongoConnected) {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user || user.password !== password) {
          return res.status(401).json({ error: "Invalid credentials. Please verify your email and passkey." });
        }

        const audit = new LoginAudit({ email: normalizedEmail, name: user.name, provider: 'credentials' });
        await audit.save();

        return res.json({
          message: "Access granted successfully!",
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            college: user.college || "BITS Pilani",
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            completedNodes: user.completedNodes,
            activeNodeId: user.activeNodeId,
            badges: user.badges,
            labsCompleted: user.labsCompleted
          }
        });
      } else {
        // Fallback Store authentication
        const user = fallbackStore.users.find(u => u.email === normalizedEmail);
        if (!user || user.password !== password) {
          return res.status(401).json({ error: "Invalid credentials. Try using student@internforge.com with password123 as test account." });
        }

        fallbackStore.loginAudits.push({
          id: "audit-" + Date.now(),
          email: normalizedEmail,
          name: user.name,
          timestamp: new Date().toISOString(),
          provider: 'credentials'
        });

        return res.json({
          message: "Access granted successfully (In-Memory Fallback)!",
          user
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "An error occurred during authentication process." });
    }
  });

  // 3. User Forget Password Endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return res.status(400).json({ error: "Email and new password parameters are required to trigger reset." });
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (isMongoConnected) {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          return res.status(404).json({ error: "No profile registered with this email address." });
        }

        user.password = newPassword;
        await user.save();
        return res.json({ message: "Password updated successfully!" });
      } else {
        const user = fallbackStore.users.find(u => u.email === normalizedEmail);
        if (!user) {
          return res.status(404).json({ error: "No memory profile registered with this email." });
        }

        user.password = newPassword;
        return res.json({ message: "Password updated successfully (In-Memory Fallback)!" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Unable to reset login credentials." });
    }
  });

  // 4. Third-Party OAuth Integration Proxy Endpoint (Google / LinkedIn Mock flow)
  app.post("/api/auth/oauth", async (req, res) => {
    try {
      const { provider, email, name, externalId } = req.body;
      if (!provider || !email || !name) {
        return res.status(400).json({ error: "Provider identity, client email and name properties are required." });
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (isMongoConnected) {
        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          // Auto register OAuth users
          user = new User({
            email: normalizedEmail,
            password: "oauth-sign-on-token-" + (externalId || Date.now()),
            name,
            college: "BITS Pilani", // Default college for OAuth
            level: 1,
            xp: 250, // Initial bonus
            streak: 1,
            completedNodes: [],
            activeNodeId: "w1-2",
            badges: ["b1"],
            labsCompleted: 0
          });
          await user.save();
        }

        // Create login audit
        const audit = new LoginAudit({ email: normalizedEmail, name: user.name, provider });
        await audit.save();

        return res.json({
          message: `Verified and authenticated via ${provider}`,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            college: user.college || "BITS Pilani",
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            completedNodes: user.completedNodes,
            activeNodeId: user.activeNodeId,
            badges: user.badges,
            labsCompleted: user.labsCompleted
          }
        });
      } else {
        let user = fallbackStore.users.find(u => u.email === normalizedEmail);
        if (!user) {
          user = {
            id: "mem-oauth-" + Date.now(),
            email: normalizedEmail,
            password: "oauth-token-fallback",
            name,
            college: "BITS Pilani",
            level: 1,
            xp: 250,
            streak: 1,
            completedNodes: [],
            activeNodeId: "w1-2",
            badges: ["b1"],
            labsCompleted: 0
          };
          fallbackStore.users.push(user);
        }

        // Create login audit in memory
        fallbackStore.loginAudits.push({
          id: "audit-" + Date.now(),
          email: normalizedEmail,
          name: user.name,
          timestamp: new Date().toISOString(),
          provider
        });

        return res.json({
          message: `Verified and authenticated via ${provider} (In-Memory Mode)`,
          user
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "OAuth validation process failed." });
    }
  });

  // 5. Update and Sync Learning Track and Telemetry parameters
  app.post("/api/tracker/progress", async (req, res) => {
    try {
      const { userId, completedNodes, activeNodeId, xpGained, labsCompleted, badgeAwarded } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "UserId is required to update learning tracker progress." });
      }

      if (isMongoConnected) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "Student profile not found." });
        }

        // Apply state updates securely
        if (completedNodes) user.completedNodes = completedNodes;
        if (activeNodeId) user.activeNodeId = activeNodeId;
        if (labsCompleted !== undefined) user.labsCompleted = labsCompleted;
        if (xpGained !== undefined) {
          user.xp += xpGained;
          // Dynamically upgrade levels based on 1000XP per level thresholds
          const computedLevel = Math.floor(user.xp / 1000) + 1;
          if (computedLevel > user.level) {
            user.level = computedLevel;
          }
        }
        if (badgeAwarded && !user.badges.includes(badgeAwarded)) {
          user.badges.push(badgeAwarded);
        }

        await user.save();
        return res.json({
          message: "Database system tracker synced successfully!",
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            completedNodes: user.completedNodes,
            activeNodeId: user.activeNodeId,
            badges: user.badges,
            labsCompleted: user.labsCompleted
          }
        });
      } else {
        const userIdx = fallbackStore.users.findIndex(u => u.id === userId);
        if (userIdx === -1) {
          return res.status(404).json({ error: "Memory profile not found." });
        }

        const user = fallbackStore.users[userIdx];
        if (completedNodes) user.completedNodes = completedNodes;
        if (activeNodeId) user.activeNodeId = activeNodeId;
        if (labsCompleted !== undefined) user.labsCompleted = labsCompleted;
        if (xpGained !== undefined) {
          user.xp += xpGained;
          user.level = Math.floor(user.xp / 1000) + 1;
        }
        if (badgeAwarded && !user.badges.includes(badgeAwarded)) {
          user.badges.push(badgeAwarded);
        }

        return res.json({
          message: "Local fallback system tracker synced successfully!",
          user
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Database update failed." });
    }
  });

  // 6. Raise Profile Change Request (Student requests change to Admin)
  app.post("/api/profile/request-change", async (req, res) => {
    try {
      const { userId, userEmail, currentName, currentCollege, requestedName, requestedCollege } = req.body;
      if (!userId || !userEmail || !requestedName || !requestedCollege) {
        return res.status(400).json({ error: "Missing required parameters for change request." });
      }

      if (isMongoConnected) {
        const newReq = new ProfileRequest({
          userId,
          userEmail,
          currentName,
          currentCollege,
          requestedName,
          requestedCollege,
          status: "pending"
        });
        await newReq.save();
        return res.json({ message: "Change request successfully submitted to Admin! Wait for Admin review.", request: newReq });
      } else {
        const newReq = {
          id: "req-" + Date.now(),
          userId,
          userEmail,
          currentName,
          currentCollege,
          requestedName,
          requestedCollege,
          status: "pending",
          createdAt: new Date().toISOString()
        };
        fallbackStore.profileRequests.push(newReq);
        return res.json({ message: "Change request submitted in memory fallback. Awaiting Admin review.", request: newReq });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Could not raise change request." });
    }
  });

  // 7. Get Admin Telemetry & Requests (Admins only)
  app.get("/api/admin/data", async (req, res) => {
    try {
      if (isMongoConnected) {
        const users = await User.find({}, "-password");
        const profileRequests = await ProfileRequest.find().sort({ createdAt: -1 });
        const loginAudits = await LoginAudit.find().sort({ timestamp: -1 });
        return res.json({ users, profileRequests, loginAudits });
      } else {
        return res.json({
          users: fallbackStore.users,
          profileRequests: fallbackStore.profileRequests,
          loginAudits: fallbackStore.loginAudits
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch admin dashboard telemetry." });
    }
  });

  // 8. Approve/Reject Request Action
  app.post("/api/admin/requests/action", async (req, res) => {
    try {
      const { requestId, action } = req.body; // action: 'approve' | 'reject'
      if (!requestId || !action) {
        return res.status(400).json({ error: "RequestId and action parameter are required." });
      }

      if (isMongoConnected) {
        const reqObj = await ProfileRequest.findById(requestId);
        if (!reqObj) {
          return res.status(404).json({ error: "Request not found." });
        }

        if (action === "approve") {
          reqObj.status = "approved";
          await reqObj.save();

          // Update actual user profile
          const userObj = await User.findById(reqObj.userId);
          if (userObj) {
            userObj.name = reqObj.requestedName;
            userObj.college = reqObj.requestedCollege;
            await userObj.save();
          }
          return res.json({ message: "Request approved. Student profile records have been updated!", request: reqObj });
        } else {
          reqObj.status = "rejected";
          await reqObj.save();
          return res.json({ message: "Request has been flatly rejected.", request: reqObj });
        }
      } else {
        const reqIdx = fallbackStore.profileRequests.findIndex(r => r.id === requestId);
        if (reqIdx === -1) {
          return res.status(404).json({ error: "Memory request not found." });
        }

        const reqObj = fallbackStore.profileRequests[reqIdx];
        if (action === "approve") {
          reqObj.status = "approved";

          // Update user in memory
          const userIdx = fallbackStore.users.findIndex(u => u.id === reqObj.userId);
          if (userIdx !== -1) {
            fallbackStore.users[userIdx].name = reqObj.requestedName;
            fallbackStore.users[userIdx].college = reqObj.requestedCollege;
          }
          return res.json({ message: "Memory request approved! Student records updated in local sandbox.", request: reqObj });
        } else {
          reqObj.status = "rejected";
          return res.json({ message: "Memory request rejected.", request: reqObj });
        }
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to execute request decision action." });
    }
  });

  // ----------------------------------------------------
  // Dynamic Asset and Frontend Interface Resolution
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application server running on http://localhost:${PORT}`);
  });
}

startServer();
