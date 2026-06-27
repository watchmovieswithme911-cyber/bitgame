#!/bin/bash
# 24/7 Agent Deployment Script
# Deploy the AI Agent as a systemd service or Docker container

set -e

echo "🚀 BitGame 24/7 AI Agent Setup"
echo "================================="

# Check if running as root (for systemd)
if [ "$EUID" -eq 0 ]; then
  echo "Installing as systemd service..."
  
  cat > /etc/systemd/system/bitgame-agent.service << 'EOF'
[Unit]
Description=BitGame 24/7 AI Agent Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/bitgame
ExecStart=/usr/bin/bun run src/agent/server.ts
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable bitgame-agent
  systemctl start bitgame-agent
  systemctl status bitgame-agent
  
  echo "✅ Agent installed as systemd service"
  echo "   Start: systemctl start bitgame-agent"
  echo "   Stop: systemctl stop bitgame-agent"
  echo "   Logs: journalctl -u bitgame-agent -f"
else
  echo "Running in development mode..."
  echo "Run: bun run start:agent"
fi
