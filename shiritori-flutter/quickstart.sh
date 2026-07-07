#!/bin/bash
# Quick start script for Flutter Shiritori game

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🎮 Flutter Shiritori Quick Start${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if Flutter is installed
echo -e "${YELLOW}[1/6] Checking Flutter installation...${NC}"
if ! command -v flutter &> /dev/null; then
    echo -e "${RED}❌ Flutter not found!${NC}"
    echo -e "${YELLOW}Please install Flutter: https://flutter.dev/docs/get-started/install${NC}"
    exit 1
else
    FLUTTER_VERSION=$(flutter --version | head -n 1)
    echo -e "${GREEN}✅ Flutter found: $FLUTTER_VERSION${NC}"
fi

# Check if Firebase CLI is installed
echo -e "${YELLOW}[2/6] Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Firebase CLI not found${NC}"
    echo -e "${CYAN}Installing Firebase CLI...${NC}"
    npm install -g firebase-tools
else
    echo -e "${GREEN}✅ Firebase CLI found${NC}"
fi

# Check if FlutterFire CLI is installed
echo -e "${YELLOW}[3/6] Checking FlutterFire CLI...${NC}"
if ! command -v flutterfire &> /dev/null; then
    echo -e "${YELLOW}⚠️  FlutterFire CLI not found${NC}"
    echo -e "${CYAN}Installing FlutterFire CLI...${NC}"
    dart pub global activate flutterfire_cli
else
    echo -e "${GREEN}✅ FlutterFire CLI found${NC}"
fi

# Get Flutter dependencies
echo -e "${YELLOW}[4/6] Getting Flutter dependencies...${NC}"
flutter pub get
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Configure Firebase (optional)
echo -e "${YELLOW}[5/6] Firebase configuration...${NC}"
if [ ! -f "lib/firebase_options.dart" ]; then
    echo -e "${CYAN}Configuring Firebase...${NC}"
    echo -e "${YELLOW}This will open a browser to select your Firebase project${NC}"
    read -p "Press Enter to continue or Ctrl+C to skip..."
    flutterfire configure --project=shiritori-game-ccaae
    echo -e "${GREEN}✅ Firebase configured${NC}"
else
    echo -e "${GREEN}✅ Firebase already configured${NC}"
    echo -e "${CYAN}To reconfigure, run: flutterfire configure --project=shiritori-game-ccaae${NC}"
fi

# Run the app
echo -e "${YELLOW}[6/6] Starting the app...${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Choose how to run:${NC}"
echo -e "  1) ${GREEN}Web${NC} (Chrome) - Recommended for development"
echo -e "  2) ${GREEN}Web${NC} (Edge)"
echo -e "  3) ${GREEN}Android${NC} emulator"
echo -e "  4) ${GREEN}iOS${NC} simulator (macOS only)"
echo -e "  5) ${GREEN}Desktop${NC} (current OS)"
echo -e "  6) ${GREEN}Build${NC} for production"
echo -e "  7) ${GREEN}Deploy${NC} to Firebase Hosting"
echo ""

read -p "Enter choice (1-7): " choice

case $choice in
    1)
        echo -e "${CYAN}Running on Chrome...${NC}"
        flutter run -d chrome
        ;;
    2)
        echo -e "${CYAN}Running on Edge...${NC}"
        flutter run -d edge
        ;;
    3)
        echo -e "${CYAN}Running on Android...${NC}"
        flutter run
        ;;
    4)
        echo -e "${CYAN}Running on iOS...${NC}"
        flutter run
        ;;
    5)
        echo -e "${CYAN}Running on desktop...${NC}"
        flutter run
        ;;
    6)
        echo -e "${CYAN}Building for web (production)...${NC}"
        flutter build web --wasm
        echo -e "${GREEN}✅ Build complete!${NC}"
        echo -e "${CYAN}Output: build/web/${NC}"
        ;;
    7)
        echo -e "${CYAN}Building and deploying...${NC}"
        flutter build web --wasm
        firebase deploy --only hosting
        echo -e "${GREEN}✅ Deployed!${NC}"
        echo -e "${CYAN}Visit: https://shiritori-game-ccaae.web.app${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice. Running on Chrome by default...${NC}"
        flutter run -d chrome
        ;;
esac

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎮 Flutter Shiritori is running!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Useful commands:${NC}"
echo -e "  ${YELLOW}flutter run -d chrome${NC}         - Run on web"
echo -e "  ${YELLOW}flutter build web --wasm${NC}      - Build for production"
echo -e "  ${YELLOW}firebase deploy --only hosting${NC} - Deploy to Firebase"
echo -e "  ${YELLOW}flutter doctor${NC}                - Check Flutter setup"
echo ""
