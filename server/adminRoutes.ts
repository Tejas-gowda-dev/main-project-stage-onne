import express from "express";
import { User, ProfileRequest, LoginAudit, Transaction } from "./models";
import { fallbackStore, isMongoConnected } from "./db";

const router = express.Router();

// 1. Paginated Users endpoint
router.get("/users/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string || "").toLowerCase().trim();
    const skip = (page - 1) * limit;

    let total = 0;
    let items: any[] = [];

    if (isMongoConnected) {
      const query = search 
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { college: { $regex: search, $options: "i" } }
            ]
          }
        : {};
      
      total = await User.countDocuments(query);
      items = await User.find(query).sort({ xp: -1 }).skip(skip).limit(limit);
    } else {
      const filtered = fallbackStore.users.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.college || "").toLowerCase().includes(search)
      );
      total = filtered.length;
      
      // Sort memory items by xp descending
      const sorted = [...filtered].sort((a, b) => b.xp - a.xp);
      items = sorted.slice(skip, skip + limit);
    }

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch paginated users." });
  }
});

// 2. Paginated Transactions endpoint
router.get("/transactions/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string || "").toLowerCase().trim();
    const statusFilter = (req.query.status as string || "all").toLowerCase().trim();
    const skip = (page - 1) * limit;

    let total = 0;
    let items: any[] = [];

    if (isMongoConnected) {
      const filters: any = {};
      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }
      if (search) {
        filters.$or = [
          { userName: { $regex: search, $options: "i" } },
          { userEmail: { $regex: search, $options: "i" } },
          { programTitle: { $regex: search, $options: "i" } },
          { paymentGateway: { $regex: search, $options: "i" } }
        ];
      }

      total = await Transaction.countDocuments(filters);
      items = await Transaction.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit);
    } else {
      let filtered = (fallbackStore.transactions || []);
      if (statusFilter !== "all") {
        filtered = filtered.filter(t => t.status === statusFilter);
      }
      if (search) {
        filtered = filtered.filter(t => 
          t.userName.toLowerCase().includes(search) ||
          t.userEmail.toLowerCase().includes(search) ||
          t.programTitle.toLowerCase().includes(search) ||
          t.paymentGateway.toLowerCase().includes(search)
        );
      }

      total = filtered.length;
      // Sort by timestamp descending
      const sorted = [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      items = sorted.slice(skip, skip + limit);
    }

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch paginated transactions." });
  }
});

// 3. Paginated Login Audits endpoint
router.get("/logins/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string || "").toLowerCase().trim();
    const skip = (page - 1) * limit;

    let total = 0;
    let items: any[] = [];

    if (isMongoConnected) {
      const query = search 
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { provider: { $regex: search, $options: "i" } }
            ]
          }
        : {};

      total = await LoginAudit.countDocuments(query);
      items = await LoginAudit.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit);
    } else {
      const filtered = (fallbackStore.loginAudits || []).filter(a => 
        (a.name || "").toLowerCase().includes(search) ||
        a.email.toLowerCase().includes(search) ||
        (a.provider || "").toLowerCase().includes(search)
      );

      total = filtered.length;
      // Sort by timestamp descending
      const sorted = [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      items = sorted.slice(skip, skip + limit);
    }

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch paginated logins." });
  }
});

// 4. Paginated Profile Requests endpoint
router.get("/requests/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let total = 0;
    let items: any[] = [];

    if (isMongoConnected) {
      total = await ProfileRequest.countDocuments({});
      items = await ProfileRequest.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    } else {
      const filtered = (fallbackStore.profileRequests || []);
      total = filtered.length;
      
      const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      items = sorted.slice(skip, skip + limit);
    }

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch paginated requests." });
  }
});

export default router;
