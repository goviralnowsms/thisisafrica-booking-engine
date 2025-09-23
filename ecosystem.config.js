module.exports = {
  apps: [{
    name: 'thisisafrica',
    script: 'node_modules/.bin/next',
    args: 'start',
    instances: 2, // Run 2 instances for zero-downtime deployments
    exec_mode: 'cluster', // Enable cluster mode
    wait_ready: true, // Wait for app to be ready before considering it online
    listen_timeout: 5000, // Time to wait for app to be ready (ms)
    kill_timeout: 5000, // Time to wait before forcefully killing the app (ms)
    max_memory_restart: '1G', // Restart if memory exceeds 1GB
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true, // Add timestamp to logs
    merge_logs: true, // Merge logs from all instances
    autorestart: true, // Auto restart if app crashes
    watch: false, // Don't watch for file changes in production
    max_restarts: 10, // Maximum number of restarts within min_uptime
    min_uptime: '10s', // Minimum uptime before considering app stable
    // Graceful shutdown
    shutdown_with_message: false,
    // Environment variables from .env.production.local will be loaded automatically
  }]
}