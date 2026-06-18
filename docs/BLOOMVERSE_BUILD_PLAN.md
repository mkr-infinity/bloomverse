# Bloomverse Build Plan

This document is the required pre-code plan for Bloomverse. It follows the PRD order: architecture, Firestore design, security rules, folder structure, data flow, feature dependencies, and development roadmap.

## 1. Architecture

Bloomverse is a 3D browser game world built as a Next.js application. The public experience loads directly into a low-poly civilization scene, not a website landing page. Interface elements must behave like game artifacts layered over the world.

### Client Architecture

- Next.js 15 App Router renders the application shell.
- React client components host the interactive world, overlays, onboarding, audio, profile cards, and citizen creation flow.
- React Three Fiber owns the 3D world scene.
- Three.js provides geometry, lighting, materials, camera movement, fog, and weather effects.
- Framer Motion handles cinematic UI transitions and overlay movement.
- Tailwind CSS is limited to Bloomverse custom design tokens. Default color palettes must not be used as final design values.
- Howler.js manages local audio from `/audio` only.

### World Architecture

- The world is a low-poly city made of districts, landmarks, citizen homes, dream objects, nature, weather, creatures, and sky events.
- Camera controls support pan, zoom, smooth movement, and cinematic target transitions.
- No first-person or FPS camera behavior is allowed.
- Search, onboarding, timeline, and profile interactions move the camera smoothly to world coordinates.
- World entities are rendered from shared Firestore data plus required starter landmarks.

### Persistence Architecture

- Local user state uses `localStorage` by default.
- IndexedDB is reserved for larger local data such as drafts, search caches, and future offline snapshots.
- Shared civilization data uses Firebase Firestore.
- Firebase Storage is used only for approved user-uploaded assets if uploads are enabled.
- Firebase Analytics records aggregate product analytics only after Firebase is configured.

### Anti-Spam Architecture

- No login is required.
- A local device ID is generated and persisted.
- Browser fingerprinting requires explicit implementation approval because it can be privacy-sensitive.
- Client-side cooldowns improve UX but cannot be trusted as security.
- Firestore rules validate document shape, lengths, enums, and immutable fields.
- Strong rate limits require a trusted backend layer such as Firebase Cloud Functions, Vercel server routes, or Firebase App Check enforcement.

## 2. Firestore Design

The PRD requires efficient collections and low read/write cost. The design below maps directly to named PRD features.

### Collections

| Collection | Purpose | Read Pattern | Write Pattern |
| --- | --- | --- | --- |
| `worldStats` | World age, citizen count, dreams, landmarks, time capsules, discoveries | Single summary document | Batched or server-maintained counters |
| `citizens` | Citizen profile, avatar, reputation, social links, creation data | Query visible citizens, fetch profile by id | Created once per device/citizen limit |
| `legacyBooks` | Citizen legacy entries and generated legacy book | Fetch by citizen id | Created with citizen |
| `homes` | Citizen home world placement and visual metadata | Query by district/viewport | Created with citizen |
| `dreams` | Citizen dream text, dream object, dream sky star | Query by district/sky/search | Created with citizen or dream action |
| `landmarks` | Starter, community, legendary, and winning event structures | Query by district/type | Starter seeded, community-created by approved flow |
| `districts` | District definitions and world coordinates | Read mostly static | Seeded/managed |
| `favorites` | Favorites for dreams, landmarks, profiles, creations | Query by target or citizen/device | User-created with limits |
| `hallOfLegends` | Most loved, oldest, highest reputation, discoveries, legendary landmark, community hero | Single summary document | Computed/maintained |
| `discoveries` | Mystery, secret, landmark, event discovery records | Query by citizen/device | Created when discovered |
| `timeCapsules` | Citizen messages with unlock dates | Query unlockable/public capsules | Created by citizen with limits |
| `timeline` | Citizen joined, landmark created, discovery found, event won, dream added | Paginated newest-first | Appended on world events |
| `communityEvents` | Weekly votes and winning structures | Current event plus history | Votes and event results |
| `newspaperIssues` | Bloomverse Times generated from world activity | Latest issue plus archive | Generated from activity data |
| `reports` | Report system for anti-spam and moderation | Admin/review only | User-created with limits |
| `deviceLimits` | Cooldowns, contribution limits, dream limits, landmark limits, citizen limits | Read/write per device id | Updated on contribution |

### Starter Landmarks

Required starter landmarks are world-owned, not fake citizens:

- Founder Monument
- Bloom Central Plaza
- Ancient Tree
- Dream Fountain
- Community Library
- Hall Of Legends
- Observatory
- Bloomverse Museum

These exist before users join and are used by onboarding, exploration, and search.

### Required Districts

- Nature District
- Creator District
- Startup District
- Gaming District
- Dream District
- Legacy District
- Mystery District
- Future District

### Local Persistence Keys

Local keys must be namespaced under `bloomverse:`.

| Key | Stores |
| --- | --- |
| `bloomverse:device-id` | Temporary identity/device ID |
| `bloomverse:citizen-draft` | Citizen creation draft |
| `bloomverse:avatar-draft` | Avatar draft |
| `bloomverse:settings` | General settings |
| `bloomverse:audio-settings` | Mute and volume settings |
| `bloomverse:tutorial-state` | Onboarding step/progress |
| `bloomverse:camera-preferences` | Camera distance/angle preferences |
| `bloomverse:search-history` | Recent searches |
| `bloomverse:discovery-journal` | Local discovery progress mirror |

Help temporary hide state must not use localStorage because it must reset after refresh.

## 3. Security Rules Direction

Security rules must validate public writes even without login. Rules cannot fully solve spam by themselves because unauthenticated clients can generate device IDs. A stronger anti-spam design needs App Check and/or trusted server logic.

Required validation categories:

- Required fields exist.
- String fields have length limits.
- Social links are optional and URL-shaped.
- Enums only allow PRD-defined values.
- Generated immutable fields cannot change after creation.
- Reputation cannot be directly written by unauthenticated users after creation.
- Starter landmarks cannot be modified by public clients.
- Reports can be created but not publicly listed.
- Device limit documents can only affect the caller-provided device ID, pending stronger backend enforcement.

The initial rule files are stored in `/firebase/firestore.rules` and `/firebase/storage.rules`.

## 4. Folder Structure

The production project should use this structure:

| Folder | Purpose |
| --- | --- |
| `app` | Next.js routes, root layout, metadata, app-level providers |
| `components` | Reusable artifact-like UI components, panels, buttons, overlays |
| `world` | React Three Fiber scene, camera rig, landmarks, districts, weather, creatures, sky |
| `systems` | Game systems: onboarding, help, search, reputation, favorites, discoveries, timeline, events, newspaper, anti-spam |
| `firebase` | Firebase client setup, query modules, rules, indexes, storage helpers |
| `features` | Feature areas: citizen creation, profiles, creator card, hall of legends, time capsules |
| `hooks` | Reusable React hooks for persistence, audio, world state, camera, Firestore subscriptions |
| `stores` | Client state stores for scene, UI overlays, selected entities, settings |
| `audio` | Local audio files only, organized by required category |
| `animations` | Framer Motion variants, cinematic timing, camera transition presets |
| `assets` | Static non-audio assets, textures, local icons, world references |
| `types` | TypeScript domain models and shared enums |
| `utils` | Pure helpers: ids, validation, formatting, profanity checks, date math |
| `lib` | Framework integrations, constants, environment helpers |
| `docs` | Architecture, data design, asset plan, development notes |

## 5. Data Flow

1. App loads the world shell and initializes local persistence.
2. Device ID is loaded or generated locally.
3. Settings, audio settings, onboarding state, camera preferences, drafts, and search history load from localStorage.
4. Firebase initializes from environment variables only.
5. World stats and starter/shared landmarks load first.
6. Visible district citizens, homes, dreams, landmarks, and timeline entries load lazily.
7. Intro cinematic moves the camera through districts, citizens, dream objects, starter landmarks, nature, weather, and dream sky.
8. Citizen creation writes citizen, home, dream, legacy book, and timeline entry together.
9. Search queries local indexes first where possible, then Firestore queries by supported fields.
10. Selecting search results moves the camera smoothly to the target coordinate.
11. Favorites update UI optimistically, then persist to Firestore.
12. Discovery journal updates local progress and shared discovery records.
13. Time capsules store unlock dates and become visible when unlocked.
14. Community event winners become landmarks.
15. Bloomverse Times is generated from world activity records using deterministic templates unless a server generator is approved.

## 6. Feature Dependencies

| Feature | Depends On |
| --- | --- |
| 3D world | Next.js shell, R3F, world entity types, camera rig |
| Cinematic intro | Camera rig, landmarks, districts, weather, dream sky |
| Citizen creation | Local drafts, validation, device ID, Firebase writes, profanity checks |
| Profiles | Citizens, dreams, achievements, legacy books, social icons |
| Help system | UI overlay system, creator section content |
| Temporary hide | Session-only UI state |
| Onboarding | Camera rig, spotlight overlay, target registry, local tutorial state |
| Search | Entity indexes, camera target system, search history persistence |
| Reputation | Favorites, achievements, discoveries, events, legacy, time rules |
| Favorites | Device ID, target records, contribution limits |
| Hall of Legends | Reputation, favorites, citizens, discoveries, landmarks |
| Discoveries | Hidden mystery coordinates, journal persistence, shared records |
| Time capsules | Citizen identity, unlock date rules, Firestore queries |
| Dream sky | Dreams, night mode, hover tooltip system |
| Shooting stars | Random event system, dream sky, wish persistence |
| Weather and seasons | World renderer, audio manager, visual effects |
| Creatures | Citizen count thresholds, world stats |
| Audio | Local `/audio` files, Howler.js, persisted settings |
| Anti-spam | Device ID, validation, cooldowns, optional trusted backend |
| Newspaper | Timeline, events, citizens, dreams, deterministic generation |

## 7. Development Roadmap

### Phase 1: Foundation

- Scaffold Next.js 15, TypeScript, Tailwind CSS, R3F, Framer Motion, Firebase, Howler, icons.
- Add custom Bloomverse design tokens.
- Add environment-only Firebase config.
- Add local persistence helpers.
- Add domain types from PRD entities.

### Phase 2: Living World Shell

- Build low-poly 3D scene.
- Add pan/zoom/smooth camera movement.
- Add starter districts and landmarks.
- Add cinematic first-visit intro.
- Add world age/stat display.

### Phase 3: Core Game Systems

- Add help button and help panel.
- Add onboarding with darkened world, spotlight, glow, camera movement, controls, persisted progress.
- Add search across citizens, dreams, landmarks, districts, events, timeline entries.
- Add profile hover tooltip and full profile card.

### Phase 4: Citizen Legacy

- Add no-login citizen creation.
- Add avatar creation after avatar rules are clarified.
- Add home, dream object, profile, and legacy book creation.
- Add social icons.
- Add local drafts and Firestore writes.

### Phase 5: Civilization Systems

- Add favorites and legendary landmark promotion.
- Add reputation and unlocks after scoring rules are approved.
- Add hall of legends.
- Add discovery journal and hidden mysteries.
- Add time capsules.
- Add history timeline.
- Add community events.
- Add Bloomverse Times.

### Phase 6: Atmosphere

- Add weather and seasons.
- Add dream sky and shooting stars.
- Add creature thresholds.
- Add local audio and settings after audio files are available.

### Phase 7: Hardening

- Add anti-spam enforcement within approved backend limits.
- Add Firestore indexes.
- Add performance optimization for 60 FPS.
- Add mobile controls.
- Run build/lint/type checks.

## Current Blockers

Implementation that would require assumptions is blocked until clarified:

- Firebase project configuration values are not provided.
- Strong no-login anti-spam cannot be guaranteed with Firestore rules alone.
- Browser fingerprinting needs privacy approval.
- Real local audio files are missing.
- Instagram, LinkedIn, and Website for MKR Infinity are not provided.
- Avatar creation method is unspecified.
- Reputation scoring formula is unspecified.
- Community event scheduling authority is unspecified.
- Storage upload permissions are unspecified.
