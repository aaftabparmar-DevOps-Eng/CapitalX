#!/bin/bash
echo "🐳 Installing Docker..."
sudo apt update -y
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
newgrp docker
echo "✅ Docker installed!"
