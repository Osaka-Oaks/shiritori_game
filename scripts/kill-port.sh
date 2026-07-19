#!/bin/bash
# Kill Process on Port
# Finds and kills any process listening on a specified port

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get port from argument or use default
PORT=${1:-5601}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔪 Kill Process on Port ${PORT}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if port number is valid
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    echo -e "${RED}❌ Invalid port number: $PORT${NC}"
    echo -e "${YELLOW}Usage: $0 [port]${NC}"
    echo -e "${YELLOW}Example: $0 5601${NC}"
    exit 1
fi

# Find process using the port
echo -e "${CYAN}Checking port ${PORT}...${NC}"

# Try lsof first (most reliable on macOS)
if command -v lsof &> /dev/null; then
    PID=$(lsof -ti:$PORT 2>/dev/null)
    
    if [ -z "$PID" ]; then
        echo -e "${GREEN}✅ Port ${PORT} is not in use${NC}"
        echo ""
        exit 0
    fi
    
    # Get process info
    PROCESS_INFO=$(lsof -i:$PORT 2>/dev/null | tail -n +2)
    
    echo -e "${YELLOW}Found process(es) using port ${PORT}:${NC}"
    echo ""
    echo -e "${CYAN}PID    COMMAND          USER${NC}"
    echo "$PROCESS_INFO" | awk '{printf "%-6s %-16s %s\n", $2, $1, $3}'
    echo ""
    
    # Ask for confirmation
    read -p "Kill these process(es)? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${YELLOW}Attempting to kill process(es)...${NC}"
        
        # Try graceful kill first
        for pid in $PID; do
            echo -e "${CYAN}Sending SIGTERM to PID $pid...${NC}"
            kill -15 $pid 2>/dev/null || echo -e "${YELLOW}⚠️  Could not send SIGTERM to PID $pid${NC}"
        done
        
        # Wait a moment
        sleep 2
        
        # Check if still running
        STILL_RUNNING=$(lsof -ti:$PORT 2>/dev/null)
        
        if [ -n "$STILL_RUNNING" ]; then
            echo -e "${YELLOW}Process(es) still running, trying SIGKILL...${NC}"
            for pid in $STILL_RUNNING; do
                echo -e "${CYAN}Sending SIGKILL to PID $pid...${NC}"
                kill -9 $pid 2>/dev/null || echo -e "${RED}❌ Could not kill PID $pid${NC}"
            done
            
            sleep 1
            
            # Final check
            FINAL_CHECK=$(lsof -ti:$PORT 2>/dev/null)
            if [ -z "$FINAL_CHECK" ]; then
                echo ""
                echo -e "${GREEN}✅ Successfully killed all processes on port ${PORT}${NC}"
            else
                echo ""
                echo -e "${RED}❌ Some processes could not be killed. Try with sudo:${NC}"
                echo -e "${YELLOW}sudo $0 $PORT${NC}"
                exit 1
            fi
        else
            echo ""
            echo -e "${GREEN}✅ Successfully killed process(es) on port ${PORT}${NC}"
        fi
        
        # Verify port is free
        sleep 1
        VERIFY=$(lsof -ti:$PORT 2>/dev/null)
        if [ -z "$VERIFY" ]; then
            echo -e "${GREEN}✅ Port ${PORT} is now free${NC}"
        else
            echo -e "${RED}❌ Port ${PORT} is still in use${NC}"
            exit 1
        fi
    else
        echo ""
        echo -e "${YELLOW}Cancelled. No processes were killed.${NC}"
        exit 0
    fi

# Fallback to netstat (Linux/older systems)
elif command -v netstat &> /dev/null; then
    echo -e "${CYAN}Using netstat...${NC}"
    
    PID=$(netstat -tulpn 2>/dev/null | grep ":$PORT" | awk '{print $7}' | cut -d'/' -f1)
    
    if [ -z "$PID" ]; then
        echo -e "${GREEN}✅ Port ${PORT} is not in use${NC}"
        echo ""
        exit 0
    fi
    
    echo -e "${YELLOW}Found PID: $PID${NC}"
    
    # Ask for confirmation
    read -p "Kill this process? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill -9 $PID 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Successfully killed process on port ${PORT}${NC}"
        else
            echo -e "${RED}❌ Failed to kill process. Try with sudo:${NC}"
            echo -e "${YELLOW}sudo $0 $PORT${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}Cancelled.${NC}"
        exit 0
    fi

else
    echo -e "${RED}❌ Neither lsof nor netstat found${NC}"
    echo -e "${YELLOW}Please install lsof or use a different method${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Done!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
