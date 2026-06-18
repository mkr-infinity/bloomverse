<p align="center">
  <img src="public/logo.svg" alt="Bloomverse Logo" width="180" height="180"/>
</p>

<h1 align="center">Bloomverse</h1>

<p align="center">
  <em>A living digital civilization — where every visitor leaves a permanent legacy</em>
</p>

<p align="center">
  <a href="https://github.com/mkr-infinity/bloomverse/stargazers">
    <img src="https://img.shields.io/github/stars/mkr-infinity/bloomverse?style=for-the-badge&logo=github&color=f0c96b" alt="Stars"/>
  </a>
  <a href="https://github.com/mkr-infinity/bloomverse/network">
    <img src="https://img.shields.io/github/forks/mkr-infinity/bloomverse?style=for-the-badge&logo=github&color=c96b5f" alt="Forks"/>
  </a>
  <a href="https://github.com/mkr-infinity/bloomverse/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-75b7ca?style=for-the-badge" alt="License"/>
  </a>
  <br/>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Three.js-r171-000000?style=for-the-badge&logo=three.js" alt="Three.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/3D-React%20Three%20Fiber-ff4154?style=for-the-badge" alt="R3F"/>
  <img src="https://img.shields.io/badge/Tailwind-CSS-06b6d4?style=for-the-badge&logo=tailwindcss" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/commits-2000%2B-6bcb77?style=for-the-badge" alt="Commits"/>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-world-screenshot">Screenshots</a> •
  <a href="#-districts">Districts</a> •
  <a href="#-getting-started">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-world-systems">World Systems</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-creator">Creator</a>
</p>

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/mkr-infinity">MKR Infinity</a></sub>
</div>

---

## 🌍 What is Bloomverse?

**Bloomverse** is an experimental **living digital civilization** — an interactive 3D world built with React Three Fiber and Three.js. Every visitor becomes a citizen, leaves a dream, creates discoveries, and shapes a permanent legacy.

> *"The world is born once. Every citizen shapes it forever."*

The world features procedural terrain, dynamic weather, day/night cycles, wildlife, vegetation, buildings, atmospheric effects, and a rich UI — all rendered in real-time 3D with no external assets.

---

## ✨ Features

### 🎮 Immersive 3D World
- **Procedural terrain** with realistic height maps and vertex coloring
- **8 unique districts** — Nature, Creator, Startup, Gaming, Dream, Legacy, Mystery, Future
- **28+ starter landmarks** with interactive selection and hover effects
- **Smooth camera** that follows exploration with lerp-based rig
- **Volumetric clouds**, twinkling stars, drifting fog, and atmospheric particles

### 🌤️ Dynamic Environment
- **Day/night cycle** with orbiting sun and moon
- **Weather system** — rain, snow, fog (with particle effects)
- **Wind system** affecting vegetation sway
- **Seasonal colors** and lighting changes
- **Aurora, lightning, and rainbow effects**

### 🌿 Living Ecosystem
- **Wildlife** — butterflies, fireflies, frogs, fish, birds
- **Vegetation** — trees (3 types), bushes, flowers, grass, vines, moss
- **Ground details** — rocks, pebbles, fallen leaves, mushrooms
- **Decorative elements** — logs, hay bales, berry bushes, fence posts

### 🏗️ World Infrastructure
- **Buildings** — cabins, towers, small houses, citizen homes
- **Decorations** — benches, signposts, lamp posts, fountains, flower pots
- **Pathways** — dirt paths, stone paths with random stones
- **Bridges** — wood bridge with railings, arch bridge
- **Fencing** — wooden fences with gates

### 🔥 Interactive Elements
- **Campfire** with animated flames, glow, and particle effects
- **Lighting** — street lamps, ground lanterns, hanging lanterns
- **Water features** — well, birdbath, small pond, stream
- **Agricultural** — garden plots, crop rows, scarecrow

### 👤 Citizen System
- Create your profile with name, avatar, dream, and quote
- Add social links (GitHub, LinkedIn, Instagram, X, Website)
- Persists across refreshes via localStorage
- Firebase-ready for shared-world data

### 🧭 Onboarding
- **14-step tutorial** with spotlight highlights and camera movement
- Keyboard navigation and visual progress indicators
- Skip anytime — returns on next visit

### 🔍 Living Search
- Search citizens, dreams, districts, landmarks, and history
- Results smoothly move the camera through the world
- Rotating placeholder text with search history

### 📖 Encyclopedia
- **13-section in-game guide** covering every system
- Searchable with instant filtering
- Covering Districts, Dreams, Reputation, Achievements, Events, Time Capsules, and more

### 🎵 Audio
- Ambient sound layer (wind, birds, rain, city ambience, UI chimes)
- Toggle mute with volume indicator
- Sound effects for UI interactions

### ♿ Accessibility
- Full keyboard navigation with skip links
- Screen reader support with ARIA labels
- Focus management and focus traps for modals
- Reduced motion and high contrast mode support

---

## 🖼️ World Screenshot

```
  ┌─────────────────────────────────────┐
  │   ✦  Bloomverse 3D World           │
  │                                     │
  │   ☁️  ☁️        🌟  🌟             │
  │      🌳  🏠  🌳                    │
  │   🌊  ⛲  🏛️  🌸                  │
  │      🦋  🌿  🪨                   │
  │   🌲  🔥  🏠  🪴                  │
  │      ✨  🌙  ☁️                    │
  │                                     │
  │   [Procedural terrain • Districts]  │
  └─────────────────────────────────────┘
```

Explore a rich 3D world with terrain, water, vegetation, buildings, wildlife, atmospheric effects, and interactive landmarks — all procedurally generated in real-time.

---

## 🏘️ Districts

| District | Theme | Position |
|----------|-------|----------|
| 🌳 **Nature** | Soft hills, old roots, bird paths, Ancient Tree | `-10, -7` |
| 🎨 **Creator** | Studios, maker homes, gallery paths | `-4, -10` |
| 🚀 **Startup** | Tiny workshops, ambitious dreams | `4, -10` |
| 🎮 **Gaming** | Playful arcades, glowing paths, challenge markers | `10, -6` |
| 💫 **Dream** | Dream objects rising toward the night sky | `9, 5` |
| 📜 **Legacy** | History paths, time capsules, legacy books | `2, 10` |
| 🔮 **Mystery** | Fog, hidden ruins, secret gardens, forgotten archives | `-6, 9` |
| 🔭 **Future** | Observatory paths, structures not yet chosen | `-11, 3` |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn**

### Quick Install
```bash
git clone https://github.com/mkr-infinity/bloomverse.git
cd bloomverse
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the world awaits.

### Build for Production
```bash
npm run build
```

### Firebase Setup (Optional)
For shared-world features (citizens, timeline, discoveries):
1. Create a Firebase project
2. Copy `.env.example` to `.env.local`
3. Add your Firebase config values
4. Deploy Firestore rules: `firebase deploy --only firestore:rules`

---

## 🏗️ Architecture

```
bloomverse/
├── app/                    # Next.js App Router
│   ├── globals.css         # Design system (1000+ lines)
│   ├── layout.tsx          # Root layout with SEO
│   └── page.tsx            # Entry point
├── components/
│   └── BloomverseApp.tsx   # Main app shell (630 lines)
├── world/                  # 3D world systems (30+ files)
│   ├── WorldScene.tsx      # Master scene orchestrator
│   ├── RealisticTerrain.tsx # Procedural height-mapped terrain
│   ├── DynamicOcean.tsx    # Animated ocean surface
│   ├── StarField.tsx       # 120 twinkling stars
│   ├── CloudLayer.tsx      # Volumetric drifting clouds
│   ├── DayNightCycle.tsx   # Orbiting sun and moon
│   ├── PrecipitationSystem.tsx # Rain and snow
│   ├── WindSystem.tsx      # Environmental wind
│   ├── Wildlife.tsx        # Butterflies, fireflies, frogs
│   ├── VegetationSystem.tsx # Trees, bushes, flowers, grass
│   ├── BuildingSystem.tsx  # Cabins, towers, houses
│   ├── Lighting.tsx        # Street lamps, lanterns
│   ├── Campfire.tsx        # Animated campfire
│   ├── Pathways.tsx        # Dirt and stone paths
│   ├── Bridges.tsx         # Wood and arch bridges
│   ├── Fencing.tsx         # Wooden fences and gates
│   ├── Seating.tsx         # Benches and stump seats
│   ├── Agricultural.tsx    # Gardens, crops, scarecrow
│   ├── WaterFeatures.tsx   # Well, birdbath, pond, stream
│   ├── AtmosphericFog.tsx  # Drifting fog particles
│   ├── AmbientParticles.tsx # Pollen, dust, falling leaves
│   ├── GroundDetails.tsx   # Rocks, pebbles, moss
│   ├── NatureDetails.tsx   # Vines, fallen leaves, berries
│   ├── DecorativeElements.tsx # Mushrooms, logs, hay bales
│   ├── EnvironmentEffects.tsx # Foliage sway, ripple
│   ├── Decorations.tsx     # Benches, signs, lamps
│   ├── Avatar.tsx          # Citizen avatar
│   ├── WeatherEffects.tsx  # Weather controller
│   └── world-data.ts       # Districts, landmarks, data
├── types/
│   └── world.ts            # All TypeScript types and enums
├── config/
│   └── constants.ts        # World constants and parameters
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── animations.ts       # Framer Motion variants
│   ├── ambient-sound.tsx   # Web Audio API sounds
│   └── local-persistence.ts # localStorage helpers
├── hooks/
│   └── use-local-storage-state.ts
├── firebase/
│   └── client.ts           # Optional Firebase config
├── systems/
│   └── audio/audio-manager.ts  # Howler.js manager
├── public/                 # Static assets (SVG, icons)
└── docs/                   # Project documentation
```

---

## 🌟 World Systems

### Terrain & Landscape
| System | Description | Details |
|--------|-------------|---------|
| `RealisticTerrain` | Procedural height map | 64x64 segments, noise displacement, vertex coloring |
| `DynamicOcean` | Animated water surface | Emissive pulse, wave motion, reflections |
| `RiverSystem` | Flowing water paths | Procedural curves, ripple animation |
| `Pathways` | Dirt and stone paths | Random stone placement, path curves |

### Atmosphere
| System | Description | Details |
|--------|-------------|---------|
| `StarField` | 120 twinkling stars | 4 colors, octahedron geometry, individual pulse |
| `CloudLayer` | Volumetric clouds | 20 clusters, drifting with wind |
| `AtmosphericFog` | Drifting fog | 40 particles, opacity pulsing |
| `WindSystem` | Global wind | Gust modulation, vegetation sway |

### Weather
| System | Description | Details |
|--------|-------------|---------|
| `PrecipitationSystem` | Rain and snow | 200 rain drops, 150 snow flakes |
| `WeatherEffects` | Weather controller | Type-based rendering |
| `DayNightCycle` | Sun and moon orbit | Point light, emissive spheres |

### Ecosystem
| System | Description | Details |
|--------|-------------|---------|
| `VegetationSystem` | Trees, bushes, flowers, grass | 4 tree types, 6 flower colors |
| `Wildlife` | Butterflies, fireflies, frogs | Wing animation, glow pulsing |
| `GroundDetails` | Rocks, pebbles, moss | Procedural placement |
| `NatureDetails` | Vines, fallen leaves, berries | Hanging vegetation |

### Infrastructure
| System | Description | Details |
|--------|-------------|---------|
| `BuildingSystem` | Cabins, towers, houses | Windows, beacon light |
| `Decorations` | Benches, signs, lamps, fountains | Interactive elements |
| `Lighting` | Street lamps, lanterns | Point lights with glow |
| `Bridges` | Wood and arch bridges | Railings, arches |
| `Fencing` | Wooden fences and gates | Crossbars, posts |
| `Seating` | Benches, stump seats | Resting spots |
| `Agricultural` | Gardens, crops, scarecrow | Farm elements |

### Details & Effects
| System | Description | Details |
|--------|-------------|---------|
| `AmbientParticles` | Pollen, dust, leaves | 30 pollen, 25 dust motes |
| `Campfire` | Animated fire | Flames, glow, point light |
| `WaterFeatures` | Well, birdbath, pond, stream | Water animations |
| `EnvironmentEffects` | Foliage sway, ripple | Wind response |
| `DecorativeElements` | Mushrooms, logs, hay | World dressing |

---

## 🛠️ Tech Stack

| Frontend | 3D Graphics | State & Data | Tooling |
|----------|-------------|--------------|---------|
| Next.js 15 | Three.js r171 | Zustand (store) | TypeScript 5.7 |
| React 19 | React Three Fiber 9 | localStorage | Tailwind CSS 3.4 |
| Framer Motion 12 | R3F Drei | Firebase 11 | ESLint 9 |
| Lucide React | — | Howler.js 2.2 | PostCSS |

---

## 🗺️ Roadmap

### ✅ Current (Implemented)
- [x] Procedural terrain with height mapping
- [x] Dynamic ocean with animated waves
- [x] Day/night cycle with orbital sun and moon
- [x] Weather system (rain, snow, fog)
- [x] Wind system affecting vegetation
- [x] Star field with 120 twinkling stars
- [x] Volumetric cloud layer
- [x] Wildlife (butterflies, fireflies, frogs)
- [x] Vegetation system (trees, bushes, flowers, grass)
- [x] Building system (cabins, towers, houses)
- [x] Lighting system (lamps, lanterns)
- [x] Interactive campfire with glow
- [x] Pathways and bridges
- [x] Water features (ponds, well, birdbath, stream)
- [x] Agricultural elements (gardens, crops, scarecrow)
- [x] Ambient particles (pollen, dust, leaves)
- [x] Atmospheric fog
- [x] Ground details (rocks, pebbles, moss)
- [x] Decorative elements (mushrooms, logs, hay)
- [x] Citizen avatar system
- [x] 14-step onboarding tutorial
- [x] Living search system
- [x] Encyclopedia help center
- [x] Audio system (ambient, UI)
- [x] Accessibility (keyboard, ARIA, reduced motion)
- [x] Firebase integration (optional)
- [x] 2000+ commits, 30+ world files, 1000+ CSS rules
- [x] Static export for GitHub Pages

### 🔜 Planned
- [ ] Multiplayer citizen interactions
- [ ] Persistent world state via Firebase
- [ ] Seasonal events and festivals
- [ ] Audio system with procedural music
- [ ] Mobile touch controls
- [ ] VR/AR support
- [ ] Community voting and events
- [ ] Time capsules and legacy messaging
- [ ] Dynamic quest system
- [ ] Achievement and reputation system

---

## 🤝 Contributing

Contributions are welcome! Bloomverse thrives on community participation.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-idea`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-idea`
5. Open a Pull Request

Please follow existing code patterns, include TypeScript types, and ensure the build passes.

---

## 📄 License

This project is **open source** under the MIT License. Created with passion for the open web.

---

## 👨‍💻 Creator

**Mohammad Kaif Raja** — Full-Stack Developer / Game Designer / Visionary

<p align="center">
  <a href="https://github.com/mkr-infinity" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <a href="https://www.instagram.com/mkr_infinity" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"/>
  </a>
  <a href="https://t.me/mkr_infinity" target="_blank">
    <img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"/>
  </a>
  <a href="https://mkr-infinity.github.io" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-151d2e?style=for-the-badge&logo=github&logoColor=white" alt="Portfolio"/>
  </a>
  <a href="https://www.buymeacoffee.com/mkr_infinity" target="_blank">
    <img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"/>
  </a>
  <a href="https://supportmkr.netlify.app" target="_blank">
    <img src="https://img.shields.io/badge/Support-6bcb77?style=for-the-badge&logo=openstreetmap&logoColor=white" alt="Support"/>
  </a>
</p>

> *Bloomverse was created as an experimental living digital civilization where every visitor leaves a permanent legacy. Built with passion for the open web.*

---

<p align="center">
  <img src="public/logo.svg" alt="Bloomverse" width="48" height="48"/>
  <br/>
  <sub>Made with 🌱 by MKR Infinity</sub>
  <br/>
  <sub>© 2026 Bloomverse — Open Source. Forever.</sub>
</p>
