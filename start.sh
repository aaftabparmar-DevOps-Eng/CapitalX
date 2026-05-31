#!/bin/bash
echo "🚀 Starting CapitalX..."
sudo docker compose up -d --build
echo "⏳ Waiting 30 seconds..."
sleep 30
sudo docker ps
echo "✅ Done! Open: http://$(curl -s ifconfig.me):3000"
