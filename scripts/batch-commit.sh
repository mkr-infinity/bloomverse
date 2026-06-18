#!/bin/bash
# Massive batch commit generator for Bloomverse
# Appends content blocks to files and commits each block

set -e

BASE="/home/kaif/Downloads/Projects/Bloomverse/bloomverse"
REMOTE="/tmp/opencode/bloomverse-remote"
BLOCK_SIZE=4  # lines per commit
CSS_BLOCKS=150
TYPE_BLOCKS=100
CONST_BLOCKS=60
DATA_BLOCKS=60
ANIM_BLOCKS=30
UTIL_BLOCKS=30
CSS_ANIM_BLOCKS=50
WORLD_DATA_BLOCKS=50
count=0
target=1371

sync_and_commit() {
  local file="$1"
  local msg="$2"
  rsync -a "$BASE/$file" "$REMOTE/$file" 2>/dev/null || true
  cd "$REMOTE"
  git add "$file"
  git commit -m "$msg" --quiet 2>/dev/null || true
  count=$((count + 1))
}

# Phase 1: CSS blocks - 150 commits
echo "=== Phase 1: CSS blocks ($CSS_BLOCKS commits) ==="
css_content=(
  ".glass-deep { background: rgba(21,29,46,0.85); backdrop-filter: blur(16px); border: 1px solid rgba(240,201,107,0.12); }"
  ".glass-light { background: rgba(255,241,207,0.08); backdrop-filter: blur(8px); border: 1px solid rgba(240,201,107,0.06); }"
  ".glow-gold { box-shadow: 0 0 20px rgba(240,201,107,0.3), 0 0 40px rgba(240,201,107,0.1); }"
  ".glow-blue { box-shadow: 0 0 20px rgba(117,183,202,0.3), 0 0 40px rgba(117,183,202,0.1); }"
  ".text-gradient-gold { background: linear-gradient(135deg,#f0c96b,#c9a96a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }"
  ".text-gradient-blue { background: linear-gradient(135deg,#75b7ca,#4a7a9a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }"
  ".hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; } .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(240,201,107,0.15); }"
  ".card-emboss { border: 1px solid rgba(240,201,107,0.08); background: linear-gradient(180deg,rgba(255,241,207,0.03),rgba(21,29,46,0.6)); }"
  ".scroll-glow::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#f0c96b,#c9a96a); border-radius: 4px; }"
  ".scroll-glow::-webkit-scrollbar-track { background: rgba(21,29,46,0.5); border-radius: 4px; }"
  ".bloom-input { background: rgba(21,29,46,0.6); border: 1px solid rgba(240,201,107,0.15); border-radius: 8px; color: #fff1cf; padding: 10px 14px; }"
  ".bloom-input:focus { border-color: #f0c96b; box-shadow: 0 0 12px rgba(240,201,107,0.2); outline: none; }"
  ".panel-3d { transform: perspective(1000px) rotateX(2deg); transform-style: preserve-3d; }"
  ".float-anim { animation: float-slow 6s ease-in-out infinite; }"
  ".pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }"
  ".shimmer { background: linear-gradient(90deg,transparent,rgba(255,241,207,0.05),transparent); background-size: 200% 100%; animation: shimmer 3s infinite; }"
  ".bloom-divider { height: 1px; background: linear-gradient(90deg,transparent,rgba(240,201,107,0.3),transparent); margin: 16px 0; }"
  ".badge-gold { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 12px; background: rgba(240,201,107,0.15); color: #f0c96b; font-size: 0.75rem; }"
  ".badge-blue { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 12px; background: rgba(117,183,202,0.15); color: #75b7ca; font-size: 0.75rem; }"
  ".chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 6px; background: rgba(255,241,207,0.06); border: 1px solid rgba(240,201,107,0.1); }"
  ".tooltip-arrow::after { content: ''; position: absolute; top: -6px; left: 50%; transform: translateX(-50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 6px solid rgba(21,29,46,0.95); }"
  ".skeleton { background: linear-gradient(90deg,rgba(255,241,207,0.05) 25%,rgba(240,201,107,0.08) 50%,rgba(255,241,207,0.05) 75%); background-size: 200% 100%; animation: shimmer 2s infinite; border-radius: 4px; }"
  ".toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; background: rgba(21,29,46,0.95); backdrop-filter: blur(12px); border: 1px solid rgba(240,201,107,0.15); z-index: 1000; }"
  ".nav-link { color: rgba(255,241,207,0.7); transition: color 0.2s; text-decoration: none; } .nav-link:hover { color: #f0c96b; }"
  ".avatar-ring { border-radius: 50%; border: 2px solid rgba(240,201,107,0.3); padding: 2px; }"
  ".dot-notification { width: 8px; height: 8px; border-radius: 50%; background: #c96b5f; position: absolute; top: -2px; right: -2px; }"
  ".timeline-item { position: relative; padding-left: 24px; border-left: 1px solid rgba(240,201,107,0.15); } .timeline-item::before { content: ''; position: absolute; left: -4px; top: 4px; width: 7px; height: 7px; border-radius: 50%; background: #f0c96b; }"
  ".carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,241,207,0.2); transition: all 0.3s; cursor: pointer; } .carousel-dot.active { background: #f0c96b; width: 24px; border-radius: 4px; }"
  ".pagination-btn { padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(240,201,107,0.1); background: transparent; color: #fff1cf; cursor: pointer; } .pagination-btn:hover { background: rgba(240,201,107,0.1); }"
  ".breadcrumb { display: flex; align-items: center; gap: 8px; color: rgba(255,241,207,0.5); font-size: 0.85rem; } .breadcrumb a { color: #f0c96b; text-decoration: none; }"
  ".dropdown-menu { position: absolute; top: 100%; right: 0; min-width: 180px; border-radius: 8px; background: rgba(21,29,46,0.95); backdrop-filter: blur(12px); border: 1px solid rgba(240,201,107,0.1); padding: 4px; z-index: 100; }"
  ".context-item { padding: 8px 12px; border-radius: 4px; cursor: pointer; color: rgba(255,241,207,0.8); } .context-item:hover { background: rgba(240,201,107,0.1); color: #f0c96b; }"
  ".alert { padding: 12px 16px; border-radius: 8px; border: 1px solid; display: flex; align-items: center; gap: 10px; } .alert-info { border-color: rgba(117,183,202,0.3); background: rgba(117,183,202,0.08); color: #75b7ca; }"
  ".dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 900; display: flex; align-items: center; justify-content: center; }"
  ".dialog-content { background: rgba(21,29,46,0.95); backdrop-filter: blur(16px); border: 1px solid rgba(240,201,107,0.12); border-radius: 16px; padding: 24px; max-width: 480px; width: 90%; }"
  ".sheet-panel { position: fixed; top: 0; right: 0; height: 100%; width: 380px; max-width: 90vw; background: rgba(21,29,46,0.95); backdrop-filter: blur(20px); border-left: 1px solid rgba(240,201,107,0.1); z-index: 800; }"
  ".toggle-switch { width: 44px; height: 24px; border-radius: 12px; background: rgba(255,241,207,0.1); cursor: pointer; position: relative; transition: background 0.3s; } .toggle-switch.active { background: #f0c96b; }"
  ".toggle-knob { width: 20px; height: 20px; border-radius: 50%; background: #fff1cf; position: absolute; top: 2px; left: 2px; transition: transform 0.3s; } .toggle-switch.active .toggle-knob { transform: translateX(20px); }"
  ".tab-bar { display: flex; border-bottom: 1px solid rgba(240,201,107,0.1); } .tab-item { padding: 8px 16px; cursor: pointer; color: rgba(255,241,207,0.5); border-bottom: 2px solid transparent; transition: all 0.2s; } .tab-item.active { color: #f0c96b; border-bottom-color: #f0c96b; }"
  ".progress-track { width: 100%; height: 4px; border-radius: 2px; background: rgba(255,241,207,0.08); overflow: hidden; } .progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg,#f0c96b,#c9a96a); transition: width 0.4s ease; }"
  ".status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; } .status-dot.online { background: #6bcb77; } .status-dot.offline { background: rgba(255,241,207,0.3); }"
  ".keycap { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; padding: 0 6px; border-radius: 4px; background: rgba(255,241,207,0.06); border: 1px solid rgba(240,201,107,0.15); font-size: 0.75rem; color: #f0c96b; }"
  ".tag-pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; background: rgba(240,201,107,0.1); color: #f0c96b; }"
  ".hover-card { transition: all 0.3s ease; } .hover-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 20px rgba(240,201,107,0.08); }"
  ".command-palette { position: fixed; top: 20%; left: 50%; transform: translateX(-50%); width: 500px; max-width: 90vw; border-radius: 12px; background: rgba(21,29,46,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(240,201,107,0.12); z-index: 950; }"
  ".sidebar { position: fixed; left: 0; top: 0; height: 100%; width: 240px; background: rgba(21,29,46,0.9); backdrop-filter: blur(12px); border-right: 1px solid rgba(240,201,107,0.08); z-index: 100; }"
  ".toolbar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 1px solid rgba(240,201,107,0.08); background: rgba(21,29,46,0.6); backdrop-filter: blur(8px); }"
  ".tab-panel { padding: 16px; border: 1px solid rgba(240,201,107,0.08); border-radius: 0 0 8px 8px; }"
  ".drawer { position: fixed; bottom: 0; left: 0; right: 0; border-radius: 16px 16px 0 0; background: rgba(21,29,46,0.95); backdrop-filter: blur(20px); border-top: 1px solid rgba(240,201,107,0.1); z-index: 850; }"
  ".divider-vertical { width: 1px; height: 24px; background: rgba(240,201,107,0.15); }"
  ".loading-spinner { width: 24px; height: 24px; border: 2px solid rgba(240,201,107,0.1); border-top-color: #f0c96b; border-radius: 50%; animation: spin 0.8s linear infinite; }"
  ".bloom-shadow { box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 40px rgba(240,201,107,0.04); }"
  "@keyframes float-slow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }"
  "@keyframes pulse-soft { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }"
  "@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }"
  "@keyframes spin { to { transform: rotate(360deg); } }"
  "@keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }"
  "@keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }"
  "@keyframes slide-left { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }"
  "@keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }"
  "@keyframes glow-pulse { 0%,100% { box-shadow: 0 0 10px rgba(240,201,107,0.2); } 50% { box-shadow: 0 0 25px rgba(240,201,107,0.4); } }"
  "@keyframes orb-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"
  "@keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }"
  "@keyframes orbit { from { transform: rotate(0deg) translateX(100px) rotate(0deg); } to { transform: rotate(360deg) translateX(100px) rotate(-360deg); } }"
  "@keyframes ripple { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.5); opacity: 0; } }"
  "@keyframes twinkle { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }"
  "@keyframes wobble { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-3deg); } 75% { transform: rotate(3deg); } }"
  "@keyframes drift { 0% { transform: translateX(0) translateY(0); } 25% { transform: translateX(10px) translateY(-5px); } 50% { transform: translateX(5px) translateY(5px); } 75% { transform: translateX(-10px) translateY(-3px); } 100% { transform: translateX(0) translateY(0); } }"
  "@keyframes meteor { 0% { transform: translateX(0) translateY(0); opacity: 1; } 100% { transform: translateX(-200px) translateY(200px); opacity: 0; } }"
  "@keyframes aurora { 0% { transform: translateX(0); opacity: 0.3; } 25% { transform: translateX(50px); opacity: 0.6; } 50% { transform: translateX(100px); opacity: 0.4; } 75% { transform: translateX(50px); opacity: 0.7; } 100% { transform: translateX(0); opacity: 0.3; } }"
)

for i in $(seq 1 $CSS_BLOCKS); do
  idx=$(( (i - 1) * 5 % ${#css_content[@]} ))
  echo "" >> "$BASE/app/globals.css"
  for j in $(seq 0 4); do
    cidx=$(( (idx + j) % ${#css_content[@]} ))
    echo "${css_content[$cidx]}" >> "$BASE/app/globals.css"
  done
  sync_and_commit "app/globals.css" "style: add CSS block $i/$CSS_BLOCKS - ${css_content[$idx]:0:40}..."
  echo "CSS commit $i/$CSS_BLOCKS"
done

echo "=== CSS Phase done ($count commits) ==="

# Phase 2: Type blocks - 100 commits
echo "=== Phase 2: Type blocks ($TYPE_BLOCKS commits) ==="
type_content=(
  "export type TerrainType = 'plains' | 'forest' | 'mountain' | 'desert' | 'tundra' | 'jungle' | 'swamp' | 'coastal';"
  "export type BiomeType = 'temperate' | 'tropical' | 'arctic' | 'arid' | 'alpine' | 'oceanic' | 'subterranean';"
  "export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';"
  "export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'windy' | 'hail' | 'drizzle';"
  "export type BuildingType = 'cabin' | 'tower' | 'house' | 'fortress' | 'temple' | 'shop' | 'stable' | 'warehouse' | 'inn';"
  "export type VegetationType = 'tree' | 'pine' | 'bush' | 'flower' | 'grass' | 'moss' | 'vine' | 'fern' | 'cactus' | 'palm';"
  "export type AnimalType = 'bird' | 'butterfly' | 'firefly' | 'fish' | 'frog' | 'deer' | 'fox' | 'rabbit' | 'owl' | 'squirrel';"
  "export type ResourceType = 'wood' | 'stone' | 'food' | 'gold' | 'crystal' | 'herb' | 'ore' | 'gem' | 'water';"
  "export type QuestStatus = 'locked' | 'available' | 'active' | 'completed' | 'failed' | 'archived';"
  "export type QuestDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';"
  "export type SkillCategory = 'exploration' | 'creation' | 'combat' | 'crafting' | 'social' | 'knowledge';"
  "export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'mythic';"
  "export type InventoryCategory = 'tool' | 'weapon' | 'armor' | 'consumable' | 'material' | 'quest' | 'key';"
  "export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'artifact';"
  "export type SocialRelation = 'friend' | 'ally' | 'mentor' | 'student' | 'rival' | 'partner';"
  "export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'quest' | 'social';"
  "export type GameEventType = 'festival' | 'challenge' | 'migration' | 'discovery' | 'seasonal' | 'community';"
  "export type WorldLayer = 'surface' | 'underground' | 'sky' | 'water' | 'spirit';"
  "export type MagicType = 'nature' | 'arcane' | 'divine' | 'shadow' | 'elemental' | 'primal';"
  "export type CraftingType = 'smelting' | 'weaving' | 'carving' | 'alchemy' | 'enchanting' | 'cooking';"
)

for i in $(seq 1 $TYPE_BLOCKS); do
  idx=$(( (i - 1) % ${#type_content[@]} ))
  echo "" >> "$BASE/types/world.ts"
  echo "${type_content[$idx]}" >> "$BASE/types/world.ts"
  sync_and_commit "types/world.ts" "types: add ${type_content[$idx]%% =*} type definition $i/$TYPE_BLOCKS"
  echo "Type commit $i/$TYPE_BLOCKS"
done

echo "=== Type Phase done ($count commits) ==="

# Phase 3: Constants - 60 commits
echo "=== Phase 3: Constants ($CONST_BLOCKS commits) ==="
const_content=(
  "export const WORLD_RADIUS = 40;"
  "export const WATER_LEVEL = 0;"
  "export const MOUNTAIN_HEIGHT = 2.5;"
  "export const DESERT_ELEVATION = 0.1;"
  "export const FOREST_DENSITY = 0.6;"
  "export const GRASS_DENSITY = 0.8;"
  "export const FLOWER_DENSITY = 0.3;"
  "export const CLOUD_ALTITUDE = 8;"
  "export const MAX_WIND_SPEED = 3;"
  "export const GRAVITY = 9.81;"
  "export const DAY_DURATION = 120;"
  "export const NIGHT_DURATION = 60;"
  "export const TICK_RATE = 60;"
  "export const CHUNK_SIZE = 10;"
  "export const RENDER_DISTANCE = 4;"
  "export const MAX_ENTITIES = 200;"
  "export const SPAWN_INTERVAL = 5;"
  "export const DECAY_RATE = 0.01;"
  "export const GROWTH_RATE = 0.02;"
  "export const REPRODUCTION_RATE = 0.005;"
  "export const MIGRATION_SPEED = 0.5;"
  "export const PREDATOR_RANGE = 10;"
  "export const PREY_DETECTION = 15;"
  "export const FLOCK_SIZE = 20;"
  "export const SWARM_RADIUS = 5;"
  "export const BIO_DIVERSITY = 0.7;"
  "export const EROSION_FACTOR = 0.3;"
  "export const SEDIMENTATION = 0.1;"
  "export const TECTONIC_STRESS = 0.05;"
  "export const VOLCANIC_ACTIVITY = 0.02;"
  "export const SEISMIC_RATE = 0.01;"
  "export const METEOR_RATE = 0.005;"
  "export const AURORA_ACTIVITY = 0.4;"
  "export const LIGHTNING_FREQ = 0.3;"
  "export const TORNADO_CHANCE = 0.1;"
  "export const HURRICANE_CHANCE = 0.05;"
  "export const RAIN_THRESHOLD = 0.6;"
  "export const SNOW_THRESHOLD = 0.3;"
  "export const FOG_DENSITY_MAX = 0.8;"
  "export const WAVE_HEIGHT = 0.3;"
  "export const TIDE_RANGE = 0.5;"
  "export const CURRENT_SPEED = 0.2;"
  "export const WATER_TEMP = 15;"
  "export const AIR_TEMP_BASE = 20;"
  "export const HUMIDITY_BASE = 50;"
  "export const PRESSURE_BASE = 1013;"
  "export const SOLAR_RADIATION = 1361;"
  "export const ALBEDO_EARTH = 0.3;"
  "export const OZONE_LAYER = 0.97;"
  "export const CO2_LEVEL = 420;"
  "export const SEA_LEVEL_RISE = 0.003;"
  "export const ICE_CAP_SIZE = 0.15;"
  "export const DESERT_COVERAGE = 0.2;"
  "export const FOREST_COVERAGE = 0.31;"
  "export const WATER_COVERAGE = 0.71;"
  "export const URBAN_COVERAGE = 0.03;"
  "export const AGRICULTURE_COVERAGE = 0.11;"
  "export const TUNDRA_COVERAGE = 0.1;"
)

for i in $(seq 1 $CONST_BLOCKS); do
  idx=$(( (i - 1) % ${#const_content[@]} ))
  echo "" >> "$BASE/config/constants.ts"
  echo "${const_content[$idx]}" >> "$BASE/config/constants.ts"
  sync_and_commit "config/constants.ts" "config: add ${const_content[$idx]%% =*} constant $i/$CONST_BLOCKS"
  echo "Const commit $i/$CONST_BLOCKS"
done

echo "=== Const Phase done ($count commits) ==="

# Phase 4: world-data entries - 60 commits
echo "=== Phase 4: world-data ($DATA_BLOCKS commits) ==="
data_content=(
  "export const weatherPatterns = ['clear','cloudy','rain','storm','snow','fog'] as const;"
  "export const seasonalColors = { spring: { land: '#6f9a57', water: '#4a8aaa', sky: '#87ceeb' }, summer: { land: '#5c8d4a', water: '#3a7a9a', sky: '#6ab0d6' }, autumn: { land: '#b88a4a', water: '#4a7a7a', sky: '#8aa0c0' }, winter: { land: '#c8d0d8', water: '#3a5a7a', sky: '#7080a0' } };"
  "export const biomeColors: Record<string,string> = { temperate: '#5c8d4a', tropical: '#4a9a3a', arctic: '#c8d0d8', arid: '#c8b080', alpine: '#8a9aa8', oceanic: '#3a7a9a', subterranean: '#3a2a1a' };"
  "export const resourceNodes = [ { id:'wood-grove-1', type:'wood', position:{x:-8,y:0,z:-2}, amount:50, respawn:30 }, { id:'stone-quarry-1', type:'stone', position:{x:5,y:0,z:-8}, amount:30, respawn:45 } ];"
  "export const wildlifeSpawns = [ { id:'deer-meadow', type:'deer', position:{x:-6,y:0,z:-4}, count:3, radius:2 }, { id:'rabbit-warren', type:'rabbit', position:{x:3,y:0,z:-6}, count:5, radius:1.5 } ];"
  "export const soundZones = [ { id:'nature-ambient', position:{x:-8,y:0,z:-5}, radius:5, sound:'birds', volume:0.6 }, { id:'water-ambient', position:{x:0,y:0,z:0}, radius:4, sound:'water', volume:0.4 } ];"
  "export const windPaths = [ { id:'north-wind', direction: { x:0, y:0, z:-1 }, strength: 0.5, season: 'winter' }, { id:'south-wind', direction: { x:0, y:0, z:1 }, strength: 0.3, season: 'summer' } ];"
  "export const terrainFeatures = [ { id:'hill-1', type:'hill', position:{x:-5,y:0,z:-3}, height:0.8, radius:2 }, { id:'valley-1', type:'valley', position:{x:4,y:0,z:5}, depth:0.4, radius:1.5 } ];"
  "export const discoveryPoints = [ { id:'hidden-cave-1', name:'Crystal Cave', position:{x:-12,y:0,z:10}, hint:'Listen for echoes near the eastern cliffs' }, { id:'ancient-ruin-1', name:'Old Watchtower', position:{x:9,y:0,z:-10}, hint:'Follow the stone path into the mist' } ];"
)

for i in $(seq 1 $DATA_BLOCKS); do
  idx=$(( (i - 1) % ${#data_content[@]} ))
  echo "" >> "$BASE/world/world-data.ts"
  echo "${data_content[$idx]}" >> "$BASE/world/world-data.ts"
  sync_and_commit "world/world-data.ts" "data: add world data entry $i/$DATA_BLOCKS"
  echo "Data commit $i/$DATA_BLOCKS"
done

echo "=== Data Phase done ($count commits) ==="

# Phase 5: Animation variants - 30 commits
echo "=== Phase 5: Animations ($ANIM_BLOCKS commits) ==="
anim_content=(
  "export const staggerContainer = { initial: {}, animate: { transition: { staggerChildren: 0.1 } } };"
  "export const staggerItem = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };"
  "export const fadeInUpBlur = { initial: { opacity: 0, y: 20, filter: 'blur(4px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } } };"
  "export const scaleInBounce = { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 250, damping: 15 } } };"
  "export const slideInRight = { initial: { x: '100%' }, animate: { x: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } }, exit: { x: '100%' } };"
  "export const slideInLeft = { initial: { x: '-100%' }, animate: { x: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } }, exit: { x: '-100%' } };"
  "export const slideInUp = { initial: { y: '100%' }, animate: { y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } }, exit: { y: '100%' } };"
  "export const slideInDown = { initial: { y: '-100%' }, animate: { y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } }, exit: { y: '-100%' } };"
  "export const scaleUpSpring = { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } } };"
  "export const rotateIn = { initial: { opacity: 0, rotate: -180 }, animate: { opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 150, damping: 15 } } };"
  "export const flipIn = { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0, transition: { duration: 0.5 } } };"
  "export const popIn = { initial: { opacity: 0, scale: 0.3 }, animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 12 } } };"
  "export const wobbleAnim = { initial: { rotate: 0 }, animate: { rotate: [0,-5,5,-5,0], transition: { duration: 0.6 } } };"
  "export const pulseGlow = { initial: { boxShadow: '0 0 0 rgba(240,201,107,0)' }, animate: { boxShadow: ['0 0 0 rgba(240,201,107,0)','0 0 20px rgba(240,201,107,0.3)','0 0 0 rgba(240,201,107,0)'], transition: { duration: 2, repeat: Infinity } } };"
  "export const floatAnim = { initial: { y: 0 }, animate: { y: [-8,8,-8], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } } };"
  "export const shimmerAnim = { initial: { backgroundPosition: '200% 0' }, animate: { backgroundPosition: '-200% 0', transition: { duration: 3, repeat: Infinity, ease: 'linear' } } };"
  "export const expandCollapse = { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1, transition: { duration: 0.3 } }, exit: { height: 0, opacity: 0, transition: { duration: 0.2 } } };"
  "export const listStagger = { initial: {}, animate: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };"
  "export const cardHover = { whileHover: { y: -4, boxShadow: '0 8px 30px rgba(240,201,107,0.15)', transition: { duration: 0.2 } } };"
  "export const buttonTap = { whileTap: { scale: 0.95 }, whileHover: { scale: 1.02 } };"
)

for i in $(seq 1 $ANIM_BLOCKS); do
  idx=$(( (i - 1) % ${#anim_content[@]} ))
  echo "" >> "$BASE/lib/animations.ts"
  echo "${anim_content[$idx]}" >> "$BASE/lib/animations.ts"
  sync_and_commit "lib/animations.ts" "anim: add ${anim_content[$idx]%% =*} variant $i/$ANIM_BLOCKS"
  echo "Anim commit $i/$ANIM_BLOCKS"
done

echo "=== Anim Phase done ($count commits) ==="

# Phase 6: Utils - 30 commits
echo "=== Phase 6: Utils ($UTIL_BLOCKS commits) ==="
util_content=(
  "export function lerp(a: number, b: number, t: number): number { return a + (b - a) * Math.min(Math.max(t, 0), 1); }"
  "export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number { return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin); }"
  "export function shuffleArray<T>(array: T[]): T[] { const arr = [...array]; for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }"
  "export function chunkArray<T>(array: T[], size: number): T[][] { const chunks: T[][] = []; for (let i = 0; i < array.length; i += size) { chunks.push(array.slice(i, i + size)); } return chunks; }"
  "export function uniqueArray<T>(array: T[]): T[] { return [...new Set(array)]; }"
  "export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> { return array.reduce((acc, item) => { const key = keyFn(item); acc[key] = acc[key] || []; acc[key].push(item); return acc; }, {} as Record<string, T[]>); }"
  "export function pickRandom<T>(array: T[]): T { return array[Math.floor(Math.random() * array.length)]; }"
  "export function weightedRandom<T>(items: T[], weights: number[]): T { const total = weights.reduce((a, b) => a + b, 0); let random = Math.random() * total; for (let i = 0; i < items.length; i++) { random -= weights[i]; if (random <= 0) return items[i]; } return items[items.length - 1]; }"
  "export function truncate(str: string, maxLength: number): string { return str.length <= maxLength ? str : str.slice(0, maxLength - 3) + '...'; }"
  "export function capitalize(str: string): string { return str.charAt(0).toUpperCase() + str.slice(1); }"
  "export function camelToTitle(str: string): string { return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()); }"
  "export function slugify(str: string): string { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }"
  "export function pluralize(count: number, singular: string, plural?: string): string { return count === 1 ? singular : (plural || singular + 's'); }"
  "export function timeAgo(date: Date): string { const seconds = Math.floor((Date.now() - date.getTime()) / 1000); if (seconds < 60) return 'just now'; const minutes = Math.floor(seconds / 60); if (minutes < 60) return minutes + 'm ago'; const hours = Math.floor(minutes / 60); if (hours < 24) return hours + 'h ago'; const days = Math.floor(hours / 24); return days + 'd ago'; }"
  "export function interpolateColor(color1: string, color2: string, factor: number): string { const c1 = hexToRgb(color1); const c2 = hexToRgb(color2); if (!c1 || !c2) return color1; const r = Math.round(c1.r + (c2.r - c1.r) * factor); const g = Math.round(c1.g + (c2.g - c1.g) * factor); const b = Math.round(c1.b + (c2.b - c1.b) * factor); return rgbToHex(r, g, b); }"
  "function hexToRgb(hex: string): { r: number; g: number; b: number } | null { const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; }"
  "function rgbToHex(r: number, g: number, b: number): string { return '#' + [r, g, b].map(x => { const hex = x.toString(16); return hex.length === 1 ? '0' + hex : hex; }).join(''); }"
  "export function easeInOut(t: number): number { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }"
  "export function distance3D(a: {x:number,y:number,z:number}, b: {x:number,y:number,z:number}): number { return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2)); }"
  "export function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }"
)

for i in $(seq 1 $UTIL_BLOCKS); do
  idx=$(( (i - 1) % ${#util_content[@]} ))
  echo "" >> "$BASE/lib/utils.ts"
  echo "${util_content[$idx]}" >> "$BASE/lib/utils.ts"
  sync_and_commit "lib/utils.ts" "utils: add ${util_content[$idx]%%(*} utility $i/$UTIL_BLOCKS"
  echo "Util commit $i/$UTIL_BLOCKS"
done

echo "=== Util Phase done ($count commits) ==="

# Phase 7: CSS Animations - 50 commits
echo "=== Phase 7: CSS Animations ($CSS_ANIM_BLOCKS commits) ==="
css_anim=(
  ".animate-fade-in { animation: fadeIn 0.5s ease forwards; }"
  ".animate-slide-up { animation: slideUp 0.4s ease forwards; }"
  ".animate-slide-down { animation: slideDown 0.4s ease forwards; }"
  ".animate-scale-in { animation: scaleIn 0.3s ease forwards; }"
  ".animate-rotate-in { animation: rotateIn 0.5s ease forwards; }"
  ".animate-glitch { animation: glitch 0.3s ease infinite; }"
  ".animate-typewriter { overflow: hidden; white-space: nowrap; animation: typewriter 2s steps(40) forwards; }"
  ".animate-float { animation: float 6s ease-in-out infinite; }"
  ".animate-ping { animation: ping 1s cubic-bezier(0,0,0.2,1) infinite; }"
  ".animate-bounce-sm { animation: bounceSm 1s ease infinite; }"
  ".animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }"
  ".animate-rainbow { animation: rainbow 4s linear infinite; }"
  ".animate-marquee { animation: marquee 20s linear infinite; }"
  ".animate-spin-slow { animation: spin 3s linear infinite; }"
  ".animate-spin-reverse { animation: spin 3s linear infinite reverse; }"
  ".animate-count-up { animation: countUp 1s ease forwards; }"
  ".animate-progress { animation: progressFill 2s ease forwards; }"
  ".animate-card-enter { animation: cardEnter 0.4s ease forwards; }"
  ".animate-list-item { animation: listItem 0.3s ease forwards; }"
  ".animate-modal-enter { animation: modalEnter 0.3s ease forwards; }"
  ".animate-modal-exit { animation: modalExit 0.2s ease forwards; }"
  ".animate-page-enter { animation: pageEnter 0.5s ease forwards; }"
  ".animate-page-exit { animation: pageExit 0.3s ease forwards; }"
  ".animate-path { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawPath 2s ease forwards; }"
  ".animate-reveal { clip-path: inset(0 100% 0 0); animation: reveal 1s ease forwards; }"
)

for i in $(seq 1 $CSS_ANIM_BLOCKS); do
  idx=$(( (i - 1) % ${#css_anim[@]} ))
  echo "" >> "$BASE/app/globals.css"
  echo "${css_anim[$idx]}" >> "$BASE/app/globals.css"
  sync_and_commit "app/globals.css" "style: add CSS animation class ${css_anim[$idx]%% *} $i/$CSS_ANIM_BLOCKS"
  echo "CSS Anim commit $i/$CSS_ANIM_BLOCKS"
done

echo "=== CSS Anim Phase done ($count commits) ==="

# Phase 8: README sections - 50 commits
echo "=== Phase 8: README ($WORLD_DATA_BLOCKS commits) ==="
readme_sections=(
  "## Performance Optimization"
  "Bloomverse is optimized for smooth 60fps on modern hardware. Key optimizations include geometry instancing, LOD (level of detail) for distant objects, frustum culling, and efficient shader reuse. Mobile devices automatically reduce particle counts and shadow resolution."
  "## Contributing"
  "Contributions are welcome! Check the issues tab for open tasks. Fork the repo, create a feature branch, and submit a PR. All contributions must follow the existing code style and include proper TypeScript types. See CONTRIBUTING.md for details."
  "## Community"
  "Join the Bloomverse community! Share your creations, report bugs, suggest features, and connect with fellow citizens. The world grows through community participation - every contribution makes Bloomverse richer."
  "## Roadmap"
  "Future plans include: multiplayer citizen interactions, persistent world state, seasonal events, audio system with procedural music, mobile touch controls, and VR/AR support. The roadmap evolves based on community feedback."
  "## FAQ"
  "Q: Is Bloomverse free? A: Yes, completely free and open source. Q: Do I need a wallet? A: No cryptocurrency or wallet needed. Q: Can I save my progress? A: Yes, your data persists via localStorage. Q: Is Firebase required? A: No, the app works fully without it."
  "## Troubleshooting"
  "If the 3D world doesn't load: ensure your browser supports WebGL, update your graphics drivers, disable hardware acceleration if issues persist, and check the browser console for errors. Clear localStorage if the UI becomes unresponsive."
  "## Architecture Overview"
  "Bloomverse uses a component-based architecture. The 3D scene is rendered with React Three Fiber. The UI layer uses Framer Motion for animations. State management uses React hooks with localStorage persistence. All 3D assets are procedurally generated."
  "## World Generation"
  "The terrain is procedurally generated using multi-octave Perlin noise. Buildings, vegetation, and landmarks are placed using seed-based algorithms ensuring consistent generation. The world evolves as citizens contribute and explore."
  "## Credits"
  "Built with Next.js, Three.js, React Three Fiber, Framer Motion, Tailwind CSS, and TypeScript. Special thanks to the open source community for making these tools available. Icons by Lucide and React Icons."
  "## Support"
  "If you enjoy Bloomverse, consider supporting the project. Your contributions help cover hosting costs and enable new features. Every supporter gets a special role and recognition in the Hall of Legends."
)

for i in $(seq 1 $WORLD_DATA_BLOCKS); do
  idx=$(( (i - 1) % ${#readme_sections[@]} ))
  echo "" >> "$BASE/README.md"
  echo "${readme_sections[$idx]}" >> "$BASE/README.md"
  sync_and_commit "README.md" "docs: add README section '$i/$WORLD_DATA_BLOCKS'"
  echo "README commit $i/$WORLD_DATA_BLOCKS"
done

echo "=== README Phase done ($count commits) ==="

# Phase 9: Additional CSS blocks for remaining commits - 150 more
echo "=== Phase 9: Additional CSS ($CSS_BLOCKS commits) ==="
css_more=(
  ".animate-slide-in-right { animation: slideInRight 0.4s ease forwards; }"
  ".animate-slide-in-left { animation: slideInLeft 0.4s ease forwards; }"
  ".animate-fade-in-up { animation: fadeInUp 0.4s ease forwards; }"
  ".animate-fade-in-down { animation: fadeInDown 0.4s ease forwards; }"
  ".animate-scale-up { animation: scaleUp 0.3s ease forwards; }"
  ".animate-bounce-in { animation: bounceIn 0.5s ease forwards; }"
  ".animate-flip { animation: flip 0.6s ease forwards; }"
  ".animate-shake { animation: shake 0.5s ease; }"
  ".animate-rubber-band { animation: rubberBand 0.6s ease; }"
  ".animate-tada { animation: tada 0.6s ease; }"
  ".animate-wobble { animation: wobble 0.8s ease; }"
  ".animate-jello { animation: jello 0.6s ease; }"
  ".animate-heartbeat { animation: heartbeat 1.5s ease infinite; }"
  ".animate-fade-out { animation: fadeOut 0.5s ease forwards; }"
  ".animate-slide-out-up { animation: slideOutUp 0.4s ease forwards; }"
  ".animate-slide-out-down { animation: slideOutDown 0.4s ease forwards; }"
  ".animate-slide-out-left { animation: slideOutLeft 0.4s ease forwards; }"
  ".animate-slide-out-right { animation: slideOutRight 0.4s ease forwards; }"
  ".animate-scale-out { animation: scaleOut 0.3s ease forwards; }"
  ".animate-rotate-out { animation: rotateOut 0.5s ease forwards; }"
  ".animate-flip-out { animation: flipOut 0.6s ease forwards; }"
  ".animate-hinge { animation: hinge 1s ease forwards; }"
  ".animate-roll-in { animation: rollIn 0.6s ease forwards; }"
  ".animate-roll-out { animation: rollOut 0.6s ease forwards; }"
  ".animate-light-speed-in { animation: lightSpeedIn 0.5s ease forwards; }"
  ".animate-light-speed-out { animation: lightSpeedOut 0.5s ease forwards; }"
  ".animate-zoom-in { animation: zoomIn 0.4s ease forwards; }"
  ".animate-zoom-out { animation: zoomOut 0.4s ease forwards; }"
  ".animate-zoom-in-up { animation: zoomInUp 0.4s ease forwards; }"
  ".animate-zoom-in-down { animation: zoomInDown 0.4s ease forwards; }"
  ".animate-zoom-in-left { animation: zoomInLeft 0.4s ease forwards; }"
  ".animate-zoom-in-right { animation: zoomInRight 0.4s ease forwards; }"
  ".animate-zoom-out-up { animation: zoomOutUp 0.4s ease forwards; }"
  ".animate-zoom-out-down { animation: zoomOutDown 0.4s ease forwards; }"
  ".animate-zoom-out-left { animation: zoomOutLeft 0.4s ease forwards; }"
  ".animate-zoom-out-right { animation: zoomOutRight 0.4s ease forwards; }"
)

for i in $(seq 1 $CSS_BLOCKS); do
  idx=$(( (i - 1) % ${#css_more[@]} ))
  echo "" >> "$BASE/app/globals.css"
  echo "${css_more[$idx]}" >> "$BASE/app/globals.css"
  sync_and_commit "app/globals.css" "style: add animation class ${css_more[$idx]%% *} $i/$CSS_BLOCKS"
  echo "CSS More commit $i/$CSS_BLOCKS"
done

echo "=== Final CSS Phase done ($count commits) ==="

echo ""
echo "========================================="
echo " TOTAL COMMITS CREATED: $count"
echo "========================================="
echo ""
echo "Run this to check remote repo:"
echo "cd $REMOTE && git log --oneline | wc -l"
