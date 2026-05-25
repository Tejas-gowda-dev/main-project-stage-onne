import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { connectToDatabase, fallbackStore } from "./server/db";
import { User, ProfileRequest, LoginAudit, Transaction } from "./server/models";
import adminRouter from "./server/adminRoutes";
import assetRouter from "./server/assetRoutes";

let isMongoConnected = false;

async function startServer() {
  // Establish database connection first
  await connectToDatabase();
  isMongoConnected = mongoose.connection.readyState === 1;

  const app = express();
  const PORT = 3000;

  // Middleware to parse payload parameters
  app.use(express.json());

  // Mount modular route controllers
  app.use("/api/admin", adminRouter);
  app.use("/api/assets", assetRouter);

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
            labsCompleted: newUser.labsCompleted,
            purchasedPrograms: newUser.purchasedPrograms || []
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
          labsCompleted: 0,
          purchasedPrograms: [] as string[]
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
        let user = await User.findOne({ email: normalizedEmail });
        if (!user && normalizedEmail === "assistant.admin@internforge.com" && password === "adminforgepass") {
          user = new User({
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
            purchasedPrograms: []
          });
          await user.save();
        }

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
            labsCompleted: user.labsCompleted,
            purchasedPrograms: user.purchasedPrograms || []
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
            labsCompleted: 0,
            purchasedPrograms: []
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
            labsCompleted: user.labsCompleted,
            purchasedPrograms: user.purchasedPrograms || []
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
            labsCompleted: 0,
            purchasedPrograms: [] as string[]
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
            labsCompleted: user.labsCompleted,
            purchasedPrograms: user.purchasedPrograms || []
          }
        });
      } else {
        let userIdx = fallbackStore.users.findIndex(u => u.id === userId);
        if (userIdx === -1) {
          if (fallbackStore.users.length > 0) {
            userIdx = 0;
          } else {
            fallbackStore.users.push({
              id: userId || "demo-user",
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
            });
            userIdx = 0;
          }
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

  // 6.5 Purchase / Unlock specialized program path
  app.post("/api/programs/purchase", async (req, res) => {
    try {
      const { userId, programId, programTitle, amount, txnStatus, paymentGateway, errorMessage } = req.body;
      if (!userId || !programId) {
        return res.status(400).json({ error: "UserId and ProgramId are required parameters." });
      }

      const verifiedStatus = txnStatus === "failed" ? "failed" : "success";
      const verifiedGateway = paymentGateway || "PhonePe";
      const actualAmount = amount || 14999;
      const actualTitle = programTitle || "Specialization Program Track";

      if (isMongoConnected) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User profile not found." });
        }

        // Record the transaction first
        const transactionRecord = new Transaction({
          userId: user._id.toString(),
          userEmail: user.email,
          userName: user.name,
          programId,
          programTitle: actualTitle,
          amount: actualAmount,
          status: verifiedStatus,
          paymentGateway: verifiedGateway,
          errorMessage: verifiedStatus === "failed" ? (errorMessage || "Bank transaction rejected.") : undefined,
          timestamp: new Date()
        });
        await transactionRecord.save();

        if (verifiedStatus === "success") {
          if (!user.purchasedPrograms) {
            user.purchasedPrograms = [];
          }

          if (!user.purchasedPrograms.includes(programId)) {
            user.purchasedPrograms.push(programId);
          }

          await user.save();
          return res.json({
            message: "Purchase processed successfully!",
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
              labsCompleted: user.labsCompleted,
              purchasedPrograms: user.purchasedPrograms
            }
          });
        } else {
          return res.status(400).json({
            error: errorMessage || "Payment Gateway failed to capture funds.",
            transactionLogged: true
          });
        }
      } else {
        let userIdx = fallbackStore.users.findIndex(u => u.id === userId);
        if (userIdx === -1) {
          if (fallbackStore.users.length > 0) {
            userIdx = 0;
          } else {
            fallbackStore.users.push({
              id: userId || "demo-user",
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
            });
            userIdx = 0;
          }
        }

        const user = fallbackStore.users[userIdx];

        // Record transaction in fallback store
        const transactionRecord = {
          id: "txn-" + Date.now(),
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          programId,
          programTitle: actualTitle,
          amount: actualAmount,
          status: verifiedStatus,
          paymentGateway: verifiedGateway,
          errorMessage: verifiedStatus === "failed" ? (errorMessage || "Bank transaction rejected.") : undefined,
          timestamp: new Date().toISOString()
        };
        if (!fallbackStore.transactions) {
          fallbackStore.transactions = [];
        }
        fallbackStore.transactions.push(transactionRecord);

        if (verifiedStatus === "success") {
          if (!user.purchasedPrograms) {
            user.purchasedPrograms = [];
          }

          if (!user.purchasedPrograms.includes(programId)) {
            user.purchasedPrograms.push(programId);
          }

          return res.json({
            message: "Purchase processed successfully using local sandbox fallback!",
            user
          });
        } else {
          return res.status(400).json({
            error: errorMessage || "Payment Gateway failed to capture funds (Sandbox).",
            transactionLogged: true
          });
        }
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Unable to complete payment sequence." });
    }
  });

  // 7. Get Admin Telemetry & Requests (Admins only)
  app.get("/api/admin/data", async (req, res) => {
    try {
      if (isMongoConnected) {
        const users = await User.find({});
        const profileRequests = await ProfileRequest.find().sort({ createdAt: -1 });
        const loginAudits = await LoginAudit.find().sort({ timestamp: -1 });
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        return res.json({ users, profileRequests, loginAudits, transactions });
      } else {
        return res.json({
          users: fallbackStore.users,
          profileRequests: fallbackStore.profileRequests,
          loginAudits: fallbackStore.loginAudits,
          transactions: fallbackStore.transactions || []
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

  // 8.2 Update student profile by Admin
  app.post("/api/admin/users/update", async (req, res) => {
    try {
      const { id, name, email, password, college, completedNodes, purchasedPrograms, level, xp, labsCompleted } = req.body;
      if (!id || !email || !name) {
        return res.status(400).json({ error: "Missing required fields: id, email, or name" });
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (isMongoConnected) {
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ error: "Candidate not found." });
        }
        user.name = name;
        user.email = normalizedEmail;
        if (password) {
          user.password = password;
        }
        if (college !== undefined) {
          user.college = college;
        }
        if (completedNodes !== undefined) {
          user.completedNodes = completedNodes;
        }
        if (purchasedPrograms !== undefined) {
          user.purchasedPrograms = purchasedPrograms;
        }
        if (level !== undefined) {
          user.level = Number(level);
        }
        if (xp !== undefined) {
          user.xp = Number(xp);
        }
        if (labsCompleted !== undefined) {
          user.labsCompleted = Number(labsCompleted);
        }
        await user.save();
        return res.json({ message: "Student record updated successfully!", user });
      } else {
        const uIdx = fallbackStore.users.findIndex(u => u.id === id);
        if (uIdx === -1) {
          return res.status(404).json({ error: "Candidate not found in local store." });
        }
        fallbackStore.users[uIdx].name = name;
        fallbackStore.users[uIdx].email = normalizedEmail;
        if (password) {
          fallbackStore.users[uIdx].password = password;
        }
        if (college !== undefined) {
          fallbackStore.users[uIdx].college = college;
        }
        if (completedNodes !== undefined) {
          fallbackStore.users[uIdx].completedNodes = completedNodes;
        }
        if (purchasedPrograms !== undefined) {
          fallbackStore.users[uIdx].purchasedPrograms = purchasedPrograms;
        }
        if (level !== undefined) {
          fallbackStore.users[uIdx].level = Number(level);
        }
        if (xp !== undefined) {
          fallbackStore.users[uIdx].xp = Number(xp);
        }
        if (labsCompleted !== undefined) {
          fallbackStore.users[uIdx].labsCompleted = Number(labsCompleted);
        }
        return res.json({ message: "Student record updated in memory!", user: fallbackStore.users[uIdx] });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update candidate record." });
    }
  });

  // 8.5 Create student profile by Admin
  app.post("/api/admin/users/create", async (req, res) => {
    try {
      const { name, email, password, college } = req.body;
      if (!email || !name || !password) {
        return res.status(400).json({ error: "Missing required fields: email, name, and password are required." });
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (isMongoConnected) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(400).json({ error: "A candidate profile with this email already exists." });
        }
        const newUser = new User({
          email: normalizedEmail,
          password,
          name,
          college: college || "BITS Pilani",
          level: 1,
          xp: 100,
          streak: 1,
          completedNodes: [],
          activeNodeId: "w1-2",
          badges: ["b1"],
          labsCompleted: 0,
          purchasedPrograms: []
        });
        await newUser.save();
        return res.json({ message: "New candidate registered successfully!", user: newUser });
      } else {
        const existing = fallbackStore.users.find(u => u.email === normalizedEmail);
        if (existing) {
          return res.status(400).json({ error: "A candidate profile with this email already exists." });
        }
        const newUser = {
          id: "mem-" + Date.now(),
          email: normalizedEmail,
          password,
          name,
          college: college || "BITS Pilani",
          level: 1,
          xp: 100,
          streak: 1,
          completedNodes: [] as string[],
          activeNodeId: "w1-2",
          badges: ["b1"],
          labsCompleted: 0,
          purchasedPrograms: [] as string[]
        };
        fallbackStore.users.push(newUser);
        return res.json({ message: "New candidate registered in memory stores!", user: newUser });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to register candidate profile." });
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
