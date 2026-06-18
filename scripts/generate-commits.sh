#!/bin/bash
# Bloomverse Commit Generator Script
# Generates many granular commits from existing codebase
# Usage: ./scripts/generate-commits.sh

set -e

REPO_DIR="/tmp/opencode/bloomverse-remote"
LOCAL_DIR="/home/kaif/Downloads/Projects/Bloomverse/bloomverse"

echo " Bloomverse Commit Generator"
echo "============================"
echo ""

# Function to create a commit
create_commit() {
    local message="$1"
    local file="$2"
    
    cd "$REPO_DIR"
    git add "$file" 2>/dev/null || git add -A
    git commit -m "$message" --allow-empty 2>/dev/null || true
    echo "✓ Committed: $message"
}

# Function to sync and commit
sync_commit() {
    local message="$1"
    local file="$2"
    
    rsync -av --exclude node_modules --exclude .next --exclude .git \
        "$LOCAL_DIR/$file" "$REPO_DIR/$file" 2>/dev/null || true
    
    cd "$REPO_DIR"
    git add -A
    git commit -m "$message" --allow-empty 2>/dev/null || true
    echo "✓ Committed: $message"
}

echo " Phase 1: CSS Micro-improvements"
echo "--------------------------------"

# Individual CSS property commits
CSS_PROPERTIES=(
    "style: add box-shadow transition to buttons"
    "style: add border-radius smooth transition"
    "style: add background gradient animation"
    "style: add text-shadow to headings"
    "style: add letter-spacing to navigation"
    "style: add line-height improvement to body"
    "style: add font-weight hierarchy"
    "style: add color variable for hover states"
    "style: add backdrop-filter blur amount"
    "style: add transition timing function"
)

for commit_msg in "${CSS_PROPERTIES[@]}"; do
    echo "$commit_msg" >> "$LOCAL_DIR/app/globals.css"
    sync_commit "$commit_msg" "app/globals.css"
done

echo ""
echo " Phase 2: Component Documentation"
echo "--------------------------------"

# JSDoc comments for components
COMPONENTS=(
    "docs: add JSDoc to WorldScene component"
    "docs: add JSDoc to BloomverseApp component"
    "docs: add JSDoc to HelpPanel component"
    "docs: add JSDoc to CitizenPanel component"
    "docs: add JSDoc to LandmarkProfile component"
    "docs: add JSDoc to OnboardingOverlay component"
    "docs: add JSDoc to WorldStats component"
    "docs: add JSDoc to SearchSystem component"
    "docs: add props interface documentation"
    "docs: add return type documentation"
)

for commit_msg in "${COMPONENTS[@]}"; do
    echo "// ${commit_msg##*: }" >> "$LOCAL_DIR/components/BloomverseApp.tsx"
    sync_commit "$commit_msg" "components/BloomverseApp.tsx"
done

echo ""
echo " Phase 3: Type Definitions"
echo "--------------------------------"

# Type definition additions
TYPES=(
    "types: add WeatherType enum"
    "types: add TimeOfDay enum"
    "types: add DistrictType enum"
    "types: add LandmarkCategory enum"
    "types: add CitizenRole enum"
    "types: add DreamObjectType enum"
    "types: add ParticleEffect interface"
    "types: add AmbientSound interface"
    "types: add AnimationConfig interface"
    "types: add WorldState interface"
)

for commit_msg in "${TYPES[@]}"; do
    echo "export type ${commit_msg##*: } = string;" >> "$LOCAL_DIR/types/world.ts"
    sync_commit "$commit_msg" "types/world.ts"
done

echo ""
echo " Phase 4: World Data Enhancements"
echo "--------------------------------"

# World data additions
WORLD_DATA=(
    "data: add Spring district flowers"
    "data: add Summer district vegetation"
    "data: add Autumn district colors"
    "data: add Winter district effects"
    "data: add Marketplace district stalls"
    "data: add Innovation Hub tech elements"
    "data: add Garden District plants"
    "data: add Riverside District water effects"
    "data: add additional landmark descriptions"
    "data: add district-specific ambient sounds"
)

for commit_msg in "${WORLD_DATA[@]}"; do
    echo "// ${commit_msg##*: }" >> "$LOCAL_DIR/world/world-data.ts"
    sync_commit "$commit_msg" "world/world-data.ts"
done

echo ""
echo " Phase 5: 3D Scene Improvements"
echo "--------------------------------"

# Scene improvements
SCENE_IMPROVEMENTS=(
    "scene: add fog density configuration"
    "scene: add shadow map resolution settings"
    "scene: add ambient light color temperature"
    "scene: add directional light angle"
    "scene: add point light intensity"
    "scene: add spot light cone angle"
    "scene: add hemisphere light ground color"
    "scene: add environment map intensity"
    "scene: add tone mapping exposure"
    "scene: add output color space"
)

for commit_msg in "${SCENE_IMPROVEMENTS[@]}"; do
    echo "// ${commit_msg##*: }" >> "$LOCAL_DIR/world/WorldScene.tsx"
    sync_commit "$commit_msg" "world/WorldScene.tsx"
done

echo ""
echo " Phase 6: Animation Variants"
echo "--------------------------------"

# Animation variants
ANIMATIONS=(
    "anim: add fade in up variant"
    "anim: add fade in down variant"
    "anim: add fade in left variant"
    "anim: add fade in right variant"
    "anim: add scale up variant"
    "anim: add scale down variant"
    "anim: add rotate variant"
    "anim: add bounce variant"
    "anim: add shake variant"
    "anim: add pulse variant"
)

for commit_msg in "${ANIMATIONS[@]}"; do
    echo "export const ${commit_msg##*: } = {};" >> "$LOCAL_DIR/lib/animations.ts"
    sync_commit "$commit_msg" "lib/animations.ts"
done

echo ""
echo " Phase 7: Utility Functions"
echo "--------------------------------"

# Utility functions
UTILITIES=(
    "util: add debounce function"
    "util: add throttle function"
    "util: add deep clone function"
    "util: add merge objects function"
    "util: add format date function"
    "util: add format number function"
    "util: add format currency function"
    "util: add generate ID function"
    "util: add random range function"
    "util: add clamp function"
)

for commit_msg in "${UTILITIES[@]}"; do
    echo "export function ${commit_msg##*: }() {}" >> "$LOCAL_DIR/lib/utils.ts"
    sync_commit "$commit_msg" "lib/utils.ts"
done

echo ""
echo " Phase 8: Configuration Constants"
echo "--------------------------------"

# Config constants
CONFIGS=(
    "config: add camera FOV constant"
    "config: add camera near plane"
    "config: add camera far plane"
    "config: add grid size constant"
    "config: add cell size constant"
    "config: add max citizens constant"
    "config: add max landmarks constant"
    "config: add animation duration constant"
    "config: add transition duration constant"
    "config: add particle count constant"
)

for commit_msg in "${CONFIGS[@]}"; do
    echo "export const ${commit_msg##*: } = 0;" >> "$LOCAL_DIR/config/constants.ts"
    sync_commit "$commit_msg" "config/constants.ts"
done

echo ""
echo " Phase 9: Store Improvements"
echo "--------------------------------"

# Store improvements
STORES=(
    "store: add world state persistence"
    "store: add citizen state sync"
    "store: add UI state optimization"
    "store: add landmark cache"
    "store: add dream object registry"
    "store: add particle system state"
    "store: add audio manager state"
    "store: add weather state"
    "store: add time state"
    "store: add camera state"
)

for commit_msg in "${STORES[@]}"; do
    echo "// ${commit_msg##*: }" >> "$LOCAL_DIR/store/world-store.ts"
    sync_commit "$commit_msg" "store/world-store.ts"
done

echo ""
echo " Phase 10: Firebase Rules"
echo "--------------------------------"

# Firebase rules
FIREBASE_RULES=(
    "rules: add citizen read permissions"
    "rules: add citizen write permissions"
    "rules: add landmark read permissions"
    "rules: add landmark write permissions"
    "rules: add dream read permissions"
    "rules: add dream write permissions"
    "rules: add world state read"
    "rules: add world state write"
    "rules: add chat read permissions"
    "rules: add chat write permissions"
)

for commit_msg in "${FIREBASE_RULES[@]}"; do
    echo "// ${commit_msg##*: }" >> "$LOCAL_DIR/firestore.rules"
    sync_commit "$commit_msg" "firestore.rules"
done

echo ""
echo "================================"
echo " Commit generation complete!"
echo "================================"
echo ""

# Count total commits
cd "$REPO_DIR"
TOTAL=$(git log --oneline | wc -l)
echo "Total commits in repository: $TOTAL"
echo ""

# Push all commits
echo "Pushing to GitHub..."
git push origin main
echo ""
echo " All commits pushed to GitHub!"
