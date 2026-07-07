#!/bin/bash
# Kill All Common Development Ports
# Kills processes on commonly used ports

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔪 Kill All Development Server Ports${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Common development ports
declare -A PORTS=(
    [3000]="React/Vite Dev Server"
    [3001]="React Dev Server (alt)"
    [4173]="Vite Preview Server"
    [5000]="Firebase Emulator"
    [5001]="Firebase Functions"
    [5173]="Vite Dev Server"
    [5174]="Vite Dev Server (alt)"
    [8080]="Development Server"
    [8081]="Metro Bundler"
    [9000]="Firebase Emulator Suite"
    [9005]="Firebase Pub/Sub Emulator"
    [9099]="Firebase Auth Emulator"
    [9199]="Firebase Storage Emulator"
    [9299]="Firebase Firestore Emulator"
    [9399]="Firebase Functions Emulator"
    [5601]="Kibana"
    [9200]="Elasticsearch"
    [9300]="Elasticsearch Transport"
    [5044]="Logstash Beats"
    [8125]="StatsD"
    [8126]="Datadog APM"
)

# Function to kill port
kill_port() {
    local port=$1
    local name=$2
    
    if command -v lsof &> /dev/null; then
        PID=$(lsof -ti:$port 2>/dev/null)
        
        if [ -n "$PID" ]; then
            echo -e "${YELLOW}Port $port ($name):${NC} Found PID $PID"
            
            # Try graceful kill
            kill -15 $PID 2>/dev/null
            sleep 1
            
            # Check if still running
            if lsof -ti:$port &> /dev/null; then
                # Force kill
                kill -9 $PID 2>/dev/null
            fi
            
            # Verify
            if ! lsof -ti:$port &> /dev/null; then
                echo -e "${GREEN}  ✅ Killed${NC}"
                return 0
            else
                echo -e "${RED}  ❌ Failed to kill${NC}"
                return 1
            fi
        fi
    fi
    return 0
}

# Check for processes
echo -e "${CYAN}Scanning for processes...${NC}"
echo ""

FOUND=0
KILLED=0

for port in "${!PORTS[@]}"; do
    if lsof -ti:$port &> /dev/null; then
        ((FOUND++))
    fi
done

if [ $FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No processes found on common development ports${NC}"
    echo ""
    exit 0
fi

echo -e "${YELLOW}Found $FOUND process(es) on development ports${NC}"
echo ""

# Ask for confirmation
read -p "Kill all found processes? (y/N): " -n 1 -r
echo
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Cancelled. No processes were killed.${NC}"
    exit 0
fi

# Kill processes
echo -e "${CYAN}Killing processes...${NC}"
echo ""

for port in $(echo "${!PORTS[@]}" | tr ' ' '\n' | sort -n); do
    name="${PORTS[$port]}"
    
    if lsof -ti:$port &> /dev/null; then
        if kill_port $port "$name"; then
            ((KILLED++))
        fi
    fi
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Killed $KILLED process(es)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Show what's still running
STILL_RUNNING=0
for port in "${!PORTS[@]}"; do
    if lsof -ti:$port &> /dev/null; then
        ((STILL_RUNNING++))
    fi
done

if [ $STILL_RUNNING -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $STILL_RUNNING port(s) still have processes running${NC}"
    echo -e "${YELLOW}Try running with sudo: sudo $0${NC}"
    echo ""
fi
