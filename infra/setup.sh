#!/bin/bash
# Quick setup script for Terraform/OpenTofu infrastructure

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🏗️  Infrastructure Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if Terraform or OpenTofu is installed
TERRAFORM_INSTALLED=false
OPENTOFU_INSTALLED=false

if command -v terraform &> /dev/null; then
    TERRAFORM_INSTALLED=true
    TERRAFORM_VERSION=$(terraform version | head -n 1)
    echo -e "${GREEN}✅ Terraform found: $TERRAFORM_VERSION${NC}"
fi

if command -v tofu &> /dev/null; then
    OPENTOFU_INSTALLED=true
    OPENTOFU_VERSION=$(tofu version | head -n 1)
    echo -e "${GREEN}✅ OpenTofu found: $OPENTOFU_VERSION${NC}"
fi

if [ "$TERRAFORM_INSTALLED" = false ] && [ "$OPENTOFU_INSTALLED" = false ]; then
    echo -e "${RED}❌ Neither Terraform nor OpenTofu is installed${NC}"
    echo ""
    echo -e "${YELLOW}Please install one of them:${NC}"
    echo ""
    echo -e "${CYAN}Option 1: Terraform (HashiCorp)${NC}"
    echo "  brew install hashicorp/tap/terraform"
    echo ""
    echo -e "${CYAN}Option 2: OpenTofu (Open Source)${NC}"
    echo "  brew install opentofu"
    echo ""
    echo -e "${YELLOW}See INSTALL_TERRAFORM.md for detailed instructions${NC}"
    exit 1
fi

# Choose which tool to use
TOOL=""
if [ "$TERRAFORM_INSTALLED" = true ]; then
    TOOL="terraform"
elif [ "$OPENTOFU_INSTALLED" = true ]; then
    TOOL="tofu"
fi

echo ""
echo -e "${CYAN}Using: $TOOL${NC}"
echo ""

# Check gcloud
echo -e "${YELLOW}Checking Google Cloud SDK...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud SDK not found${NC}"
    echo ""
    echo -e "${YELLOW}Install with:${NC}"
    echo "  brew install --cask google-cloud-sdk"
    echo "  gcloud auth login"
    echo "  gcloud auth application-default login"
    exit 1
else
    echo -e "${GREEN}✅ Google Cloud SDK found${NC}"
fi

# Select environment
echo ""
echo -e "${CYAN}Select environment:${NC}"
echo "  1) dev"
echo "  2) staging"
echo "  3) production"
echo ""
read -p "Enter choice (1-3): " env_choice

case $env_choice in
    1)
        ENV="dev"
        ;;
    2)
        ENV="staging"
        ;;
    3)
        ENV="production"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}Selected environment: $ENV${NC}"
echo ""

# Navigate to environment directory
ENV_DIR="terraform/environments/$ENV"
cd "$ENV_DIR"

# Check if tfvars file exists
TFVARS_FILE="${ENV}.tfvars"
EXAMPLE_FILE="${ENV}.tfvars.example"

if [ ! -f "$TFVARS_FILE" ]; then
    echo -e "${YELLOW}⚠️  Configuration file not found${NC}"
    
    if [ -f "$EXAMPLE_FILE" ]; then
        echo -e "${CYAN}Copying example configuration...${NC}"
        cp "$EXAMPLE_FILE" "$TFVARS_FILE"
        echo -e "${GREEN}✅ Created $TFVARS_FILE${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  Please edit $TFVARS_FILE with your settings:${NC}"
        echo "  - project_id"
        echo "  - region"
        echo "  - other environment-specific values"
        echo ""
        read -p "Press Enter after editing the file..."
    else
        echo -e "${RED}❌ Example file not found: $EXAMPLE_FILE${NC}"
        exit 1
    fi
fi

# Initialize
echo ""
echo -e "${YELLOW}Initializing $TOOL...${NC}"
if $TOOL init; then
    echo -e "${GREEN}✅ Initialization successful${NC}"
else
    echo -e "${RED}❌ Initialization failed${NC}"
    exit 1
fi

# Validate
echo ""
echo -e "${YELLOW}Validating configuration...${NC}"
if $TOOL validate; then
    echo -e "${GREEN}✅ Validation successful${NC}"
else
    echo -e "${RED}❌ Validation failed${NC}"
    exit 1
fi

# Plan
echo ""
echo -e "${YELLOW}Generating plan...${NC}"
if $TOOL plan -var-file="$TFVARS_FILE" -out=tfplan; then
    echo -e "${GREEN}✅ Plan generated${NC}"
else
    echo -e "${RED}❌ Plan failed${NC}"
    exit 1
fi

# Ask to apply
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Ready to apply changes${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Review the plan above carefully.${NC}"
echo ""
read -p "Apply changes? (yes/no): " apply_choice

if [ "$apply_choice" = "yes" ]; then
    echo ""
    echo -e "${CYAN}Applying changes...${NC}"
    if $TOOL apply tfplan; then
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}🎉 Infrastructure deployed successfully!${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "${CYAN}View outputs:${NC}"
        echo "  $TOOL output"
        echo ""
        echo -e "${CYAN}View state:${NC}"
        echo "  $TOOL show"
        echo ""
    else
        echo -e "${RED}❌ Apply failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Skipped apply. You can apply later with:${NC}"
    echo "  cd infra/$ENV_DIR"
    echo "  $TOOL apply tfplan"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
