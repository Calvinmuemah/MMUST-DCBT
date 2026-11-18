/**
 * PM2 Cluster Configuration for MMUST DCBT Backend API
 * Automatically detects available CPU cores and spawns cluster workers.
 */
module.exports = {
  apps: [
    {
      name: "mmust-api",
      script: "server.js",
      instances: process.env.PM2_INSTANCES || "max",
      exec_mode: "cluster",
      max_memory_restart: "600M",
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
