#!/bin/bash

# 🚀 CapitalX - AUTO SETUP SCRIPT
# Docker nahi hai? Install karegi! Phir sab apne aap!

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 CapitalX - AI Fintech Platform            ║${NC}"
echo -e "${BLUE}║     AUTO SETUP (Docker + All Services)        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN"
esac

echo -e "${YELLOW}📋 Detected OS: ${MACHINE}${NC}"
echo ""

# ─── CHECK SUDO ────────────────────────────
if [ "$MACHINE" = "Linux" ]; then
    if ! command -v sudo &> /dev/null; then
        echo -e "${YELLOW}⚠️  'sudo' not found. Installing...${NC}"
        apt-get update && apt-get install -y sudo
    fi
fi

# ─── INSTALL DOCKER IF NOT FOUND ───────────
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}🐳 Docker not found. Installing automatically...${NC}"
    echo ""
    
    if [ "$MACHINE" = "Linux" ]; then
        echo -e "${CYAN}📦 Installing Docker for Linux...${NC}"
        
        # Remove old versions
        sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
        
        # Update packages
        sudo apt-get update -y
        
        # Install prerequisites
        sudo apt-get install -y \
            ca-certificates \
            curl \
            gnupg \
            lsb-release
        
        # Add Docker's official GPG key
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg 2>/dev/null || \
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        
        # Add repository
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null 2>&1 || \
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
          $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Install Docker
        sudo apt-get update -y
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        # Install Docker Compose
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        
        # Start Docker
        sudo systemctl start docker 2>/dev/null || sudo service docker start
        sudo systemctl enable docker 2>/dev/null || true
        
        # Add current user to docker group
        sudo usermod -aG docker $USER 2>/dev/null || true
        
        echo -e "${GREEN}✅ Docker installed successfully!${NC}"
        
    elif [ "$MACHINE" = "Mac" ]; then
        echo -e "${CYAN}📦 Installing Docker for Mac...${NC}"
        echo -e "${YELLOW}⚠️  Please install Docker Desktop manually:${NC}"
        echo "   https://www.docker.com/products/docker-desktop"
        echo ""
        echo -e "${YELLOW}After install, rerun this script.${NC}"
        exit 0
    fi
else
    echo -e "${GREEN}✅ Docker already installed!${NC}"
fi

# Verify Docker is running
if ! docker info &> /dev/null; then
    echo -e "${YELLOW}🐳 Starting Docker service...${NC}"
    sudo systemctl start docker 2>/dev/null || sudo service docker start
    sleep 3
fi

echo -e "${GREEN}✅ Docker is running!${NC}"
echo ""

# ─── SETUP APPLICATION ────────────────────
echo -e "${YELLOW}🚀 Setting up CapitalX...${NC}"
echo ""

# Stop existing containers
docker-compose down 2>/dev/null || true

# Setup .env files
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}📝 Creating backend .env file...${NC}"
    cp backend/.env.example backend/.env
    
    # Generate random secrets
    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "capitalx_secret_$(date +%s)")
    REFRESH_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "capitalx_refresh_$(date +%s)")
    DB_PASS=$(openssl rand -hex 8 2>/dev/null || echo "capitalx123")
    
    # Update .env with secure values
    sed -i "s/DATABASE_URL=.*/DATABASE_URL=\"postgresql:\/\/postgres:${DB_PASS}@postgres:5432\/capitalx_db?schema=public\"/g" backend/.env 2>/dev/null || true
    sed -i "s/JWT_ACCESS_SECRET=.*/JWT_ACCESS_SECRET=${JWT_SECRET}/g" backend/.env 2>/dev/null || true
    sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=${REFRESH_SECRET}/g" backend/.env 2>/dev/null || true
fi

if [ ! -f frontend/.env.local ]; then
    echo -e "${YELLOW}📝 Creating frontend .env.local file...${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > frontend/.env.local
fi

# Start all services
echo -e "${YELLOW}🐳 Starting all services with Docker Compose...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check if services are running
if docker ps | grep -q capitalx; then
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 SETUP COMPLETE!                           ║${NC}"
    echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║  Frontend:  http://localhost:3000             ║${NC}"
    echo -e "${GREEN}║  Backend:   http://localhost:3001             ║${NC}"
    echo -e "${GREEN}║  Swagger:   http://localhost:3001/api/docs    ║${NC}"
    echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║  To stop:   docker-compose down               ║${NC}"
    echo -e "${GREEN}║  To view:   docker-compose logs               ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}❌ Services may not have started properly.${NC}"
    echo -e "${YELLOW}Check logs: docker-compose logs${NC}"
fi
