import express from "express";
import { Transaction, User } from "./models";
import { fallbackStore, isMongoConnected } from "./db";

const router = express.Router();

// Helper to escape CSV fields
function escapeCsv(val: any): string {
  if (val === null || val === undefined) return "";
  const str = String(val).replace(/"/g, '""');
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

// 1. Dynamic Asset: CSV Export of Transaction Logs
router.get("/export/transactions.csv", async (req, res) => {
  try {
    let list: any[] = [];
    if (isMongoConnected) {
      list = await Transaction.find({}).sort({ createdAt: -1 });
    } else {
      list = fallbackStore.transactions || [];
    }

    // Generate CSV on-the-fly
    const headers = [
      "Transaction ID",
      "User Email",
      "User Name",
      "Program Title",
      "Amount (INR)",
      "Status",
      "Payment Gateway",
      "Error Message",
      "Timestamp"
    ];

    const rows = list.map(item => [
      item.id || item._id,
      item.userEmail,
      item.userName,
      item.programTitle,
      item.amount,
      item.status,
      item.paymentGateway,
      item.errorMessage || "N/A",
      item.timestamp || item.createdAt
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(escapeCsv).join(","))
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transactions_export.csv");
    return res.status(200).send(csvContent);
  } catch (err: any) {
    res.status(500).send("Error compiling dynamic CSV: " + err.message);
  }
});

// Helper for SVG badge shapes and colors
const BADGE_DESIGNS: Record<string, { title: string; colorPrimary: string; colorSecondary: string; iconPath: string }> = {
  b1: {
    title: "Core Compiler",
    colorPrimary: "#3B82F6",
    colorSecondary: "#1D4ED8",
    iconPath: "M8 4l8 8-8 8"
  },
  b2: {
    title: "Edge Commander",
    colorPrimary: "#06B6D4",
    colorSecondary: "#0891B2",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
  },
  b3: {
    title: "Neural Architect",
    colorPrimary: "#8B5CF6",
    colorSecondary: "#6D28D9",
    iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7s0 6 8 10z"
  },
  b4: {
    title: "Autonomous Rover",
    colorPrimary: "#10B981",
    colorSecondary: "#047857",
    iconPath: "m12 14 4-4-4-4M4 14h16"
  },
  b5: {
    title: "Mega Mesh",
    colorPrimary: "#F59E0B",
    colorSecondary: "#B45309",
    iconPath: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-2h2zm0-4h-2V7h2z"
  }
};

// 2. Dynamic Asset: SVG Glowing Telemetry Badge
router.get("/badge/:badgeId.svg", async (req, res) => {
  try {
    const { badgeId } = req.params;
    const cleanBadgeId = badgeId.replace(".svg", "").trim();
    const config = BADGE_DESIGNS[cleanBadgeId] || {
      title: "Caffeine Cadet",
      colorPrimary: "#EC4899",
      colorSecondary: "#BE185D",
      iconPath: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    };

    // Parameters to customize the dynamic badge
    let username = (req.query.username as string) || "Anonymous Intern";
    let level = (req.query.level as string) || "1";
    const userId = req.query.userId as string;

    // Optional database lookup to back it with real parameters if userId is input!
    if (userId) {
      if (isMongoConnected) {
        const u = await User.findById(userId);
        if (u) {
          username = u.name;
          level = String(u.level);
        }
      } else {
        const u = fallbackStore.users.find(x => x.id === userId);
        if (u) {
          username = u.name;
          level = String(u.level);
        }
      }
    }

    // Capitalize username for the badge display
    const titleUser = username.toUpperCase();

    // Dynamically build glowing SVG representation
    const svgBadge = `
<svg xmlns="http://www.w3.org/2000/svg" width="340" height="150" viewBox="0 0 340 150">
  <defs>
    <!-- Dark Space metal backdrop gradient -->
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F111A" />
      <stop offset="50%" stop-color="#07090E" />
      <stop offset="100%" stop-color="#141824" />
    </linearGradient>

    <!-- Glowing accent colors -->
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${config.colorPrimary}" />
      <stop offset="100%" stop-color="${config.colorSecondary}" />
    </linearGradient>

    <!-- Drop Glow drop shadow -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <style>
    .font-heavy { font-family: 'Space Grotesk', 'Inter', 'Segoe UI', sans-serif; font-weight: 800; }
    .font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 8px; fill: #4B5563; }
    .badge-name { font-size: 14px; fill: #FFFFFF; font-weight: 800; letter-spacing: 0.5px; }
    .label-meta { font-size: 10px; fill: #9CA3AF; font-weight: 500; }
    .stat-val { font-size: 16px; fill: #06B6D4; font-weight: 800; }
  </style>

  <!-- Card Border & Background -->
  <rect x="2" y="2" width="336" height="146" rx="16" fill="url(#metalGrad)" stroke="url(#accentGrad)" stroke-width="1.5" />

  <!-- Hexagonal Tech Vector Art Grid (Left Column Accent) -->
  <path d="M 12 12 L 20 8 M 20 8 L 28 12 M 28 12 L 28 20 M 28 20 L 20 24 M 20 24 L 12 20 Z" fill="none" stroke="${config.colorPrimary}" stroke-opacity="0.1" stroke-width="0.75" />
  <path d="M 312 128 L 320 124 M 320 124 L 328 128 M 328 128 L 328 136 M 328 136 L 320 140 M 320 140 L 312 136 Z" fill="none" stroke="${config.colorPrimary}" stroke-opacity="0.15" stroke-width="0.75" />

  <!-- Badge Hologram Circle Ring -->
  <circle cx="56" cy="75" r="32" fill="#030712" stroke="url(#accentGrad)" stroke-dasharray="3 2" stroke-width="1.5" />
  <circle cx="56" cy="75" r="26" fill="url(#accentGrad)" fill-opacity="0.12" stroke="${config.colorPrimary}" stroke-width="0.5" filter="url(#glow)" />

  <!-- Inner Badge Symbol Icon Draw -->
  <g transform="translate(42, 61) scale(1.15)">
    <path d="${config.iconPath}" fill="none" stroke="${config.colorPrimary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />
  </g>

  <!-- User Descriptor Content Box -->
  <text x="108" y="44" class="font-heavy badge-name" fill="#FFFFFF">${config.title.toUpperCase()}</text>
  <text x="108" y="60" class="font-mono" letter-spacing="1">INTERNFORGE CERTIFICATE SEAL</text>

  <line x1="108" y1="72" x2="310" y2="72" stroke="#1F2937" stroke-width="1" />

  <!-- Detail Information -->
  <text x="108" y="98" class="font-heavy label-meta">HOLDER:</text>
  <text x="108" y="118" class="font-heavy" font-size="12" fill="#F3F4F6">${titleUser}</text>

  <text x="240" y="98" class="font-heavy label-meta">LEVEL ATHLETE:</text>
  <text x="240" y="118" class="font-heavy" font-size="15" fill="${config.colorPrimary}">Lvl ${level}</text>

  <!-- Micro metadata text bottom right -->
  <text x="210" y="136" class="font-mono" text-anchor="end" fill-opacity="0.4">// TELEMETRY_STABLE_VERIFIED</text>
</svg>
`.trim();

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).send(svgBadge);
  } catch (err: any) {
    res.status(500).send("Error compiling custom achievement vector image: " + err.message);
  }
});

export default router;
