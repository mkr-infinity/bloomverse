# Implementation Blockers

These items require user-provided information or approval before they can be implemented without hallucinating requirements.

## Firebase

- Firebase project values are missing. The app currently reads env vars from `.env.local` using the names in `.env.example`.
- Strong no-login anti-spam cannot be guaranteed with public Firestore writes alone.
- Approval is needed for Firebase App Check, Cloud Functions, or Vercel server routes if stronger rate limits are required.

## Audio

- Real audio files are missing under `/audio`.
- The audio system does not fake or reference nonexistent files.
- Add licensed local files matching `docs/AUDIO_ASSET_PLAN.md`, then wire their exact filenames into `systems/audio/audio-manager.ts`.

## Creator Links

- The PRD provides only the GitHub URL for MKR Infinity.
- Instagram, LinkedIn, Twitter/X, and Website links are not invented.
- The creator card renders the known GitHub link and inactive icon states for missing links.

## Citizen Creation

- Avatar creation method is unspecified.
- The current citizen form persists drafts locally and is disabled for final shared-world creation until Firebase is configured.

## Reputation

- Reputation sources are defined in the PRD, but exact scoring rules are not.
- Reputation unlocks need approved point values and thresholds before implementation.

## Community Events

- Weekly event scheduling authority is unspecified.
- A decision is needed: client-visible seeded events, admin-managed Firebase events, Cloud Function scheduled events, or Vercel cron.

## Storage Uploads

- User-uploaded avatar/media assets are not enabled because upload permissions and moderation requirements are unspecified.
- `firebase/storage.rules` currently denies writes by default.

## Browser Fingerprinting

- The PRD requires browser fingerprinting.
- Implementation needs explicit privacy approval and a choice between lightweight local device ID only or a stronger fingerprinting library.

## Dependency Audit

- `npm audit --omit=dev` reports a moderate advisory through Next.js' bundled PostCSS.
- The suggested `npm audit fix --force` would install an incompatible old Next.js version, so it was not applied.
