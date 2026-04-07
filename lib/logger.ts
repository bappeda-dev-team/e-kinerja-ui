// lib/logger.ts
// Winston logger — hanya untuk server-side (API routes, server components)
// Tidak bisa dipakai di middleware (Edge Runtime)

import winston from "winston"

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : ""
      return `[${timestamp}] ${level}: ${message}${metaStr}`
    })
  ),
  transports: [new winston.transports.Console()],
})

export default logger
