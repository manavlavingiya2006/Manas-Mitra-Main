# Voice update

Read [VOICE-SETUP.md](VOICE-SETUP.md) first for scan findings, multilingual setup, changes, actual language coverage and test limitations.

# Manas-Mitra — complete source, version 2

A responsive cognitive-care companion with patient, caregiver, and doctor spaces. The design follows the supplied mint, white, and navy reference: photo-led welcome, large patient tiles, calm routines, pastel games, and care dashboards. Layout adapts to laptop, tablet, and phone; it does not force a desktop canvas onto a small screen.

## Run on your computer

Install Node.js 24 LTS (or Node.js 22.13 or newer). Unzip this folder, open a terminal in it, then run:

```sh
npm install
npm start
```

Open http://localhost:3000. The demo portals work immediately. For your own saved records, choose Sign in → Create account. First create a patient account; share the displayed care-circle code privately with their caregiver and doctor so they can register linked accounts. Passwords require at least 10 characters. Each linked account sees the same patient record with role-based write permissions.

Copy `.env.example` to `.env` to configure optional providers. Never put keys in frontend JavaScript or commit `.env`. No API keys or personal records are included in this ZIP.

## Included features

- Three portal views; patient daily routine, reminders with completion confirmation, snooze and repeat controls, and emergency contact calling.
- Six playable games, each with twelve distinct themed levels (72 total): Memory Match, Picture Recognition, Word Recall, Number Sequence, Object Matching, Daily Quiz. Later matching levels add more cards; repeated mistakes offer gentler play. Illustrated symbols use the device's emoji artwork, which can vary by operating system.
- Memory album with photo upload, personal descriptions, edit/delete, and optional read-aloud.
- Recorded game scores, progress chart, CSV export, clinician notes, appointments, and shared care-circle messages. Messages remain in the application; they do not send email or SMS.
- Calm generated audio, adjustable font size, contrast, theme, motion, touch targets, voice speed and volume.
- Twelve language selections: English, Hindi, Assamese, Bengali, Manipuri/Meitei, Mizo, Khasi, Gujarati, Marathi, Tamil, Telugu, Kannada. Core interface labels and recall words are translated; some longer instructions remain English. Native-speaker review of translations is still needed.
- Device-local demo and offline cached app shell. Signed-in records are server-backed. Offline edits in a signed-in session are not a guaranteed durable sync queue; reconnect and save before closing.

## Voice and AI

The browser microphone/playback fallback works only when the browser and device supply the selected language. Cloud integration supports OpenAI conversation, transcription and speech, with optional Sarvam speech. Set `OPENAI_API_KEY` and optionally `SARVAM_API_KEY` in the local `.env`; hosted secrets must be configured separately. Connecting an account in ChatGPT does not automatically configure this application's API key. Provider billing and valid credentials are required.

The assistant supports interrupt/stop, recording, transcript correction before sending, conversation context, and spoken replies. Microphones require HTTPS or localhost and explicit browser permission. Audio is AI-generated. Demo conversation is scripted and is clearly labeled in the interface.

Configured provider language allowlists:

| Provider | Recognition | Speech playback |
| --- | --- | --- |
| OpenAI | en, hi, bn, gu, mr, ta, te, kn | en, hi, mr, ta, kn |
| Sarvam | en, hi, bn, gu, mr, ta, te, kn, as, mni | en, hi, bn, gu, mr, ta, te, kn |

Mizo and Khasi do not have cloud speech support in this build. Assamese and Meitei cloud playback also need a suitable additional provider. Device voices may offer more languages. Perfect transcription or pronunciation across all twelve languages is not claimed. Cloud calls have not been live-tested without provider credentials.

## Persistence and deployment

Local Node/Express mode uses a private `runtime-data/data.json` file by default. Set MySQL variables in `.env` to use MySQL; the app creates and uses `app_documents` for account and care-record aggregates. `database/schema.sql` also contains the original normalized schema for reference; those tables are not the active v2 record store. Use one Node instance; in-memory sessions expire after eight hours and restart on server restart. For a multi-instance public deployment, add a shared session store, password recovery, audit logging, backups, and operational monitoring.

The hosted Sites version is built with `npm run build`: a Worker with D1 records and R2 photos. `.openai/hosting.json` retains the existing Site identity. `drizzle/` contains the generated migration. Hosted identity uses the signed-in ChatGPT account; it does not use local email/password authentication. The current deployment is owner-private. Access for other people must be granted separately before they can use their linked portal accounts.

## API overview

- `GET /api/health`, `GET /api/auth/me`
- `POST /api/auth/register`, `/login`, `/logout`
- `GET|PUT /api/state` — scoped care record, role permissions, optimistic revision conflict checks
- `POST /api/ai/chat`
- `GET /api/voice/capabilities`, `POST /api/voice/transcribe`, `/speak`
- Node mode additionally exposes authenticated legacy resource routes through `routes/records.js`.

## Verification and limits

Run `npm test` for all 72 game levels, rendering every portal in every language, account isolation/permissions, and the hosted persistence API. Browser installation was unavailable in the build environment, so real-device visual and microphone QA remains outstanding. Responsive breakpoints are implemented but not certified on physical devices. Notifications run while the page is open; this is not a closed-app push service. Emergency buttons open the dialer after confirmation, not an automatic emergency dispatch. The companion does not diagnose or prescribe and game results are activity records, not clinical scores.
