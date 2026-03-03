import express from "express";
import os from "os";
import { db } from "../../db.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/role.js";

import fs from "fs";

const router = express.Router();

router.get(
  "/healthcheck",
  requireAuth,
  requireRole("owner"),
  async (req, res) => {
    const start = Date.now();

    // CPU
    const cpus = os.cpus();
    const avgCpuLoad = os.loadavg()[0].toFixed(2);

    // RAM
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPercent = (((totalMem - freeMem) / totalMem) * 100).toFixed(1);

    // Disk – Linux only via /proc/statvfs fallback
    let diskInfo = null;
    try {
      const { execSync } = await import("child_process");
      const dfOutput = execSync("df -k / --output=size,avail,pcent")
        .toString()
        .trim()
        .split("\n")[1]
        .trim()
        .split(/\s+/);

      diskInfo = {
        root: "/",
        total_gb: (parseInt(dfOutput[0]) / 1024 / 1024).toFixed(2),
        available_gb: (parseInt(dfOutput[1]) / 1024 / 1024).toFixed(2),
        used_percent: dfOutput[2],
      };
    } catch {
      diskInfo = "not supported";
    }

    // DB-Status – nutzt bestehenden Pool
    let dbStatus = "disconnected";
    try {
      await db.execute("SELECT 1");
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
    }

    // Systeminformationen
    const sys = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      uptime_s: Math.floor(os.uptime()),
      cpu_cores: cpus.length,
      cpu_load: avgCpuLoad,
      memory: {
        total_gb: (totalMem / 1024 ** 3).toFixed(2),
        used_percent: usedMemPercent,
      },
      disk: diskInfo,
    };

    // Node-Prozess
    const processInfo = {
      pid: process.pid,
      node_version: process.version,
      memory_mb: (process.memoryUsage().rss / 1024 ** 2).toFixed(1),
      uptime_s: Math.floor(process.uptime()),
    };

    res.json({
      status: dbStatus === "connected" ? "ok" : "error",
      response_time_ms: Date.now() - start,
      timestamp: new Date().toISOString(),
      database: dbStatus,
      system: sys,
      process: processInfo,
    });
  },
);

router.post(
  "/save-log",
  requireAuth,
  requireRole("owner"),
  async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "invalid log message.",
      });
    }

    try {
      fs.appendFileSync("system.log", message, "\n");

      res.json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "failed to save log message.",
      });
    }
  },
);

export default router;
