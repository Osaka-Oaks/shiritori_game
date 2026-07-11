#!/bin/bash

# Script to analyze and identify potentially dead files in the repository
# This helps maintain a clean codebase by finding unused files

set -e

ROOT_DIR=$(git rev-parse --show-toplevel)
cd "$ROOT_DIR"

echo "🔍 Analyzing repository for dead files..."
echo ""

# Function to check if a file is imported anywhere
check_file_usage() {
    local file=$1
    local filename=$(basename "$file")
    local filename_noext="${filename%.*}"
    
    # Search for imports of this file
    local imports=$(grep -r "from ['\"].*$filename_noext['\"]" \
        --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
        --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
        --exclude-dir=.history 2>/dev/null | wc -l)
    
    echo "$imports"
}

echo "📊 Dead Files Analysis Report"
echo "=============================="
echo ""

# Analyze old project directories
echo "## Old/Deprecated Projects"
echo "--------------------------"
OLD_PROJECTS=("shiritori-v1" "shiritori-word-chain")
for project in "${OLD_PROJECTS[@]}"; do
    if [ -d "$project" ]; then
        echo "⚠️  $project/ - Appears to be an old version"
        echo "   Consider: Archive or remove if no longer needed"
    fi
done
echo ""

# Analyze stitch_bilingual_shiritori_blitz
echo "## Stitch Projects"
echo "-----------------"
if [ -d "stitch_bilingual_shiritori_blitz" ]; then
    echo "⚠️  stitch_bilingual_shiritori_blitz/ - External project"
    echo "   Consider: Move to separate repository or archive"
fi
echo ""

# Check for unused components in kawaii-shiritori
echo "## Kawaii Shiritori Components"
echo "-----------------------------"
if [ -d "kawaii-shiritori/src/components" ]; then
    for component in kawaii-shiritori/src/components/*.tsx; do
        if [ -f "$component" ]; then
            component_name=$(basename "$component" .tsx)
            # Skip if it's a main view component (likely used in App.tsx)
            usage=$(grep -r "$component_name" kawaii-shiritori/src/ \
                --include="*.tsx" --include="*.ts" \
                --exclude="$(basename $component)" 2>/dev/null | wc -l)
            
            if [ "$usage" -eq 0 ]; then
                echo "❌ $component - No imports found"
            else
                echo "✅ $component - Used ($usage references)"
            fi
        fi
    done
fi
echo ""

# Check for unused lib files
echo "## Kawaii Shiritori Library Files"
echo "--------------------------------"
if [ -d "kawaii-shiritori/src/lib" ]; then
    for lib_file in kawaii-shiritori/src/lib/*.ts; do
        if [ -f "$lib_file" ] && [[ ! "$lib_file" =~ __tests__ ]]; then
            lib_name=$(basename "$lib_file" .ts)
            usage=$(grep -r "from.*['\"].*lib/$lib_name" kawaii-shiritori/src/ \
                --include="*.tsx" --include="*.ts" \
                --exclude="$(basename $lib_file)" 2>/dev/null | wc -l)
            
            if [ "$usage" -eq 0 ]; then
                echo "❌ $lib_file - No imports found"
            else
                echo "✅ $lib_file - Used ($usage references)"
            fi
        fi
    done
fi
echo ""

# Check for unused documentation
echo "## Documentation Files"
echo "---------------------"
MD_FILES=$(find . -maxdepth 1 -name "*.md" -not -name "README.md" | wc -l)
echo "📄 Found $MD_FILES additional markdown files in root"
echo "   Consider: Consolidate into docs/ folder"
echo ""

# Check .history folder
echo "## IDE History"
echo "-------------"
if [ -d ".history" ]; then
    HISTORY_SIZE=$(du -sh .history | cut -f1)
    echo "⚠️  .history/ exists - IDE history folder ($HISTORY_SIZE)"
    echo "   Action: Add to .gitignore if not already"
fi
echo ""

echo "✅ Analysis complete!"
echo ""
echo "Recommendations:"
echo "1. Archive or remove old project folders (shiritori-v1, shiritori-word-chain)"
echo "2. Ensure .history/ is in .gitignore"
echo "3. Remove unused components and library files"
echo "4. Consolidate documentation into docs/ folder"
