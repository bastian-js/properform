import express from "express";
import mysql from "mysql2/promise";
import os from "os";
import fs from "fs";
import { requireAuth } from "../../middleware/auth.js";

const router = express.Router();

router.get(
  "/healthcheck",
  requireAuth("owner"),
  requireAuth,
  async (req, res) => {
    const start = Date.now();

    // CPU
    const cpus = os.cpus();
    const avgCpuLoad = os.loadavg()[0].toFixed(2);

    // RAM
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPercent = (((totalMem - freeMem) / totalMem) * 100).toFixed(1);

    // Disk (optional – Linux)
    let diskInfo = null;
    try {
      const df = fs.statSync("/");
      diskInfo = {
        root: "/",
        available: df.blksize,
      };
    } catch {
      diskInfo = "Not supported";
    }

    // DB-Status
    let dbStatus = "disconnected";
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      await connection.execute("SELECT 1");
      await connection.end();
      dbStatus = "connected";
    } catch (err) {
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

export default router;
