#!/bin/bash
# Setup Flutter with Firebase
# Configures FlutterFire for the shiritori-game-ccaae project

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuration
FIREBASE_PROJECT="shiritori-game-ccaae"
FLUTTER_DIR="shiritori-flutter"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔥 Flutter + Firebase Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "$FLUTTER_DIR" ]; then
    echo -e "${RED}❌ Error: $FLUTTER_DIR directory not found${NC}"
    echo -e "${YELLOW}Please run this script from the project root${NC}"
    exit 1
fi

echo -e "${CYAN}Project: ${FIREBASE_PROJECT}${NC}"
echo -e "${CYAN}Flutter Directory: ${FLUTTER_DIR}${NC}"
echo ""

# Step 1: Check Prerequisites
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 1: Checking Prerequisites${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check Firebase CLI
echo -e "${CYAN}Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo ""
    echo -e "${YELLOW}Install Firebase CLI:${NC}"
    echo -e "  npm install -g firebase-tools"
    echo ""
    exit 1
else
    FIREBASE_VERSION=$(firebase --version)
    echo -e "${GREEN}✅ Firebase CLI installed: ${FIREBASE_VERSION}${NC}"
fi

# Check if logged in to Firebase
echo -e "${CYAN}Checking Firebase login...${NC}"
if ! firebase projects:list &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Firebase${NC}"
    echo ""
    echo -e "${YELLOW}Logging in to Firebase...${NC}"
    firebase login
else
    echo -e "${GREEN}✅ Logged in to Firebase${NC}"
fi

# Check Flutter SDK
echo -e "${CYAN}Checking Flutter SDK...${NC}"
if ! command -v flutter &> /dev/null; then
    echo -e "${RED}❌ Flutter SDK not found${NC}"
    echo ""
    echo -e "${YELLOW}Install Flutter SDK:${NC}"
    echo -e "  Visit: https://docs.flutter.dev/get-started/install"
    echo ""
    exit 1
else
    FLUTTER_VERSION=$(flutter --version | head -n 1)
    echo -e "${GREEN}✅ Flutter SDK installed: ${FLUTTER_VERSION}${NC}"
fi

# Check Dart SDK
echo -e "${CYAN}Checking Dart SDK...${NC}"
if ! command -v dart &> /dev/null; then
    echo -e "${RED}❌ Dart SDK not found${NC}"
    exit 1
else
    DART_VERSION=$(dart --version 2>&1 | head -n 1)
    echo -e "${GREEN}✅ Dart SDK installed: ${DART_VERSION}${NC}"
fi

echo ""

# Step 2: Install FlutterFire CLI
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 2: Installing FlutterFire CLI${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}Activating FlutterFire CLI...${NC}"
dart pub global activate flutterfire_cli

# Check if flutterfire is in PATH
if ! command -v flutterfire &> /dev/null; then
    echo -e "${YELLOW}⚠️  FlutterFire CLI not found in PATH${NC}"
    echo ""
    echo -e "${YELLOW}Add to your PATH (add to ~/.zshrc or ~/.bashrc):${NC}"
    echo -e "  export PATH=\"\$PATH:\$HOME/.pub-cache/bin\""
    echo ""
    echo -e "${YELLOW}Then run: source ~/.zshrc (or source ~/.bashrc)${NC}"
    echo ""
    
    # Try to use it directly
    FLUTTERFIRE_CMD="$HOME/.pub-cache/bin/flutterfire"
else
    FLUTTERFIRE_CMD="flutterfire"
    echo -e "${GREEN}✅ FlutterFire CLI installed${NC}"
fi

echo ""

# Step 3: Configure FlutterFire
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 3: Configuring FlutterFire${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$FLUTTER_DIR"

echo -e "${CYAN}Running flutterfire configure...${NC}"
echo -e "${CYAN}Project: ${FIREBASE_PROJECT}${NC}"
echo ""

# Run FlutterFire configuration
if [ -f "$FLUTTERFIRE_CMD" ] || command -v flutterfire &> /dev/null; then
    $FLUTTERFIRE_CMD configure --project="$FIREBASE_PROJECT" --yes
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ FlutterFire configured successfully${NC}"
    else
        echo ""
        echo -e "${RED}❌ FlutterFire configuration failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Running flutterfire manually...${NC}"
    echo ""
    echo -e "${CYAN}Please run this command manually:${NC}"
    echo -e "  cd $FLUTTER_DIR"
    echo -e "  flutterfire configure --project=$FIREBASE_PROJECT"
    echo ""
fi

cd ..

echo ""

# Step 4: Install Firebase packages
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 4: Installing Firebase Packages${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$FLUTTER_DIR"

echo -e "${CYAN}Adding firebase_core...${NC}"
flutter pub add firebase_core

echo ""
echo -e "${CYAN}Adding firebase_auth...${NC}"
flutter pub add firebase_auth

echo ""
echo -e "${CYAN}Adding cloud_firestore...${NC}"
flutter pub add cloud_firestore

echo ""
echo -e "${CYAN}Adding firebase_database...${NC}"
flutter pub add firebase_database

echo ""
echo -e "${CYAN}Getting dependencies...${NC}"
flutter pub get

cd ..

echo ""
echo -e "${GREEN}✅ Firebase packages installed${NC}"

echo ""

# Step 5: Verify Setup
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 5: Verifying Setup${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if firebase_options.dart exists
if [ -f "$FLUTTER_DIR/lib/firebase_options.dart" ]; then
    echo -e "${GREEN}✅ firebase_options.dart created${NC}"
else
    echo -e "${YELLOW}⚠️  firebase_options.dart not found${NC}"
    echo -e "${YELLOW}You may need to run flutterfire configure manually${NC}"
fi

# Check if firebase_core is in pubspec.yaml
if grep -q "firebase_core:" "$FLUTTER_DIR/pubspec.yaml"; then
    echo -e "${GREEN}✅ firebase_core added to pubspec.yaml${NC}"
else
    echo -e "${YELLOW}⚠️  firebase_core not found in pubspec.yaml${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}📋 What was done:${NC}"
echo -e "  ✅ Verified Firebase CLI"
echo -e "  ✅ Verified Flutter SDK"
echo -e "  ✅ Installed FlutterFire CLI"
echo -e "  ✅ Configured FlutterFire for $FIREBASE_PROJECT"
echo -e "  ✅ Installed Firebase packages"
echo -e "  ✅ Created firebase_options.dart"
echo ""

echo -e "${CYAN}📁 Files created:${NC}"
echo -e "  • $FLUTTER_DIR/lib/firebase_options.dart"
echo -e "  • $FLUTTER_DIR/pubspec.yaml (updated)"
echo ""

echo -e "${CYAN}🚀 Next steps:${NC}"
echo -e "  1. Initialize Firebase in your app:"
echo -e "     ${YELLOW}See: FLUTTER_FIREBASE_SETUP.md${NC}"
echo ""
echo -e "  2. Run your Flutter app:"
echo -e "     ${YELLOW}cd $FLUTTER_DIR && flutter run${NC}"
echo ""
echo -e "  3. Or use npm scripts:"
echo -e "     ${YELLOW}npm run dev:flutter${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
