# Bloomverse Audio Asset Plan

Bloomverse must use local audio only. Do not stream external audio and do not depend on paid or third-party runtime audio services.

## Required Folder Structure

- `/audio/birds`
- `/audio/wind`
- `/audio/rain`
- `/audio/city`
- `/audio/night`
- `/audio/ui`
- `/audio/music`

## Required Ambient Sounds

| Folder | Asset Need | Purpose |
| --- | --- | --- |
| `audio/birds` | daytime birds loop | Nature District, sunny mornings, citizen thresholds |
| `audio/wind` | soft leaves loop | General world ambience and calm camera movement |
| `audio/city` | gentle village murmur loop | Bloom Central Plaza, Creator District, Startup District |
| `audio/night` | night insects and distant chimes loop | Dream sky and nighttime exploration |
| `audio/music` | main Bloomverse theme loop | First visit and relaxed exploration |

## Required Weather Sounds

| Folder | Asset Need | Purpose |
| --- | --- | --- |
| `audio/rain` | soft rain loop | Rain weather |
| `audio/rain` | storm rain loop | Storm weather |
| `audio/rain` | distant thunder one-shot | Storm event accent |
| `audio/wind` | fog wind loop | Fog weather |
| `audio/wind` | winter wind loop | Snow and winter season |

## Required UI Sounds

| Folder | Asset Need | Purpose |
| --- | --- | --- |
| `audio/ui` | hover chime | Hovering citizens, dreams, landmarks, stars |
| `audio/ui` | panel open | Help panel, profile card, creator card |
| `audio/ui` | panel close | Closing overlays |
| `audio/ui` | select soft bell | Search result select, onboarding next |
| `audio/ui` | error hush | Validation error or cooldown |
| `audio/ui` | favorite sparkle | Favorite action |

## Required Event Sounds

| Folder | Asset Need | Purpose |
| --- | --- | --- |
| `audio/music` | intro swell | Cinematic intro |
| `audio/night` | bloom reveal | Dream becomes visible in sky |
| `audio/night` | shooting star pass | Shooting star event |
| `audio/city` | celebration bells | Community event winner |
| `audio/wind` | discovery shimmer | Hidden mystery discovered |

## Implementation Rules

- Audio loads through Howler.js.
- Mute and volume settings persist in `bloomverse:audio-settings`.
- Missing audio files must not be replaced with fake files.
- If a file is missing, the audio system should skip that sound and keep the world usable.
- Audio file sourcing must use free/local files with licenses compatible with the project.
- No paid APIs are allowed.

## Missing Inputs

Audio files are not present yet. Implementation of playback can be created, but actual sound output requires real files to be added under the required folders.
