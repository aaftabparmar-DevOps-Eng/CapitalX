#!/bin/bash

set -e

echo "Updating system..."
sudo apt update -y

echo "Installing dependencies..."
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

echo "Removing old Docker..."
sudo apt remove -y docker docker-engine docker.io containerd runc || true

echo "Adding Docker repository..."
sudo mkdir -p /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update -y

echo "Installing Docker..."
sudo apt install -y \
docker-ce \
docker-ce-cli \
containerd.io \
docker-buildx-plugin \
docker-compose-plugin

echo "Installing docker-compose..."
sudo curl -L \
https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) \
-o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

sudo systemctl enable docker
sudo systemctl start docker

sudo usermod -aG docker $USER
sudo newgrp docker

echo ""
echo "Docker Installed Successfully"
echo ""

docker --version
docker-compose --version
