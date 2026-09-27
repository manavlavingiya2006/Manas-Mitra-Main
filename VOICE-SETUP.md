# Multilingual assistant: findings and setup

## What the scan found

The project is not hardcoded to English throughout: its language selector already passes a language to chat, transcription and speech. However, English is the default. Changing interface labels does not install a device voice or connect a speech provider.

- Without server credentials, the application uses canned demo replies and device voices. Non-English demo answers are generic, not a real conversational engine.
- OpenAI speech output is enabled for only five of the project's languages. Gujarati, Bengali and Telugu require the Sarvam integration in this build.
- The old health display reported provider configuration as usable cloud AI even when an unsigned-in demo request would be rejected.
- Device voices can load after the first call to getVoices. The old code checked immediately and could miss a valid installed voice.
- Changing language while a request was running could play a stale reply using the new language's voice. Old messages did not retain their own language.
- Stop did not cancel transcription requests; a late response could reopen the transcript dialog.
- Both the Node backend and hosted Worker need consistent changes; editing one does not change the other.

The current Sarvam API reference uses `language_code` for TTS. This was already correct in the uploaded code. Older documentation uses a different name; the field was deliberately retained.

## Changes in this update

1. Wait for browser voice discovery, select exact locale first, and never substitute an English voice for a missing selected-language voice.
2. Stop/cancel guards cover microphone permission, recording, transcription, cloud playback and device speech. Audio URLs are released.
3. Save the language with new messages; replay them using that language. Suppress automatic playback after a language change during a request.
4. Give the AI the full language name and native-script instruction. Avoid sending the current user question twice in conversation history; keep new history in the requested language.
5. Make speech instructions explicitly name the target language on both backends. Request WAV explicitly from Sarvam and reject empty hosted audio.
6. Show sign-in requirements, listening coverage and speaking coverage separately. Add a selected-language voice test in Settings. A configured key does not mean it has valid credits.
7. Refresh the service-worker cache version so offline assets can update.

## Enable cloud conversation and speech locally

1. Install Node.js 22.13 or newer. Extract the ZIP and open the `Manas-Mitra` folder in VS Code.
2. Copy `.env.example` to `.env` in that folder. Enter your own server-side keys:

```dotenv
OPENAI_API_KEY=your_openai_api_key
SARVAM_API_KEY=your_sarvam_api_key
AI_MODEL=gpt-4.1-mini
OPENAI_STT_MODEL=gpt-4o-transcribe
OPENAI_TTS_MODEL=gpt-4o-mini-tts
ALLOW_DEMO_AI=false
```

3. Run `npm install`, then `npm start`. Open http://localhost:3000. Opening index.html directly does not run the AI server.
4. Create a patient account or sign in. The demo cannot use cloud providers with the default access policy.
5. Open Settings, choose Gujarati (or your language), enable Speak replies aloud and press Test selected language.
6. Open AI Companion. Allow microphone access, record a sentence, stop recording, review the transcript and send it. Try Gujarati: `તમે કેમ છો? આજે મારે શું કરવાનું છે?`
7. If it fails, check the language-specific status, server credentials and provider credits. Restart the server after changing `.env`. A ChatGPT connection does not populate this project's server environment.

For a hosted deployment, set the same secrets in the host's server environment and redeploy the updated project. A local `.env` does not configure an existing hosted site. Do not upload keys or put them in app.js. This task updates the ZIP, not a live deployment.

## Actual cloud coverage in this build

These are the existing conservative application allowlists, not a claim that every provider model performs equally well.

| Language | Listening with configured providers | Speaking with configured providers |
| --- | --- | --- |
| English | OpenAI or Sarvam | OpenAI or Sarvam |
| Hindi | OpenAI or Sarvam | OpenAI or Sarvam |
| Marathi | OpenAI or Sarvam | OpenAI or Sarvam |
| Tamil | OpenAI or Sarvam | OpenAI or Sarvam |
| Kannada | OpenAI or Sarvam | OpenAI or Sarvam |
| Gujarati | OpenAI or Sarvam | Sarvam |
| Bengali | OpenAI or Sarvam | Sarvam |
| Telugu | OpenAI or Sarvam | Sarvam |
| Assamese | Sarvam | No configured cloud provider |
| Manipuri / Meitei | Sarvam | No configured cloud provider |
| Mizo | No configured cloud provider | No configured cloud provider |
| Khasi | No configured cloud provider | No configured cloud provider |

An installed matching device voice can provide additional playback. Browser recognition depends on the browser/service and cannot be certified from the selector alone. OpenAI transcription quality varies by language; test it with real speakers, especially where its published quality list is limited.

To meet an all-12-language voice requirement, the remaining four languages need a verified speech provider or self-hosted language-specific model, plus native-speaker evaluation. Simply adding their codes to an allowlist does not provide speech support. This update does not claim universal language coverage, automatic language detection or continuous realtime conversation. Select the desired language before recording.

## Verification

The automated suite covers the existing portal/game/account behavior plus delayed voice loading, no English substitution, stop during a cloud response, language-aware message replay, Gujarati request payloads on Node and Worker, unavailable language rejection, and native-language prompt instructions. Hosted build generation was also checked.

Provider requests are mocked in these tests. No real API credentials were supplied, so live transcription, audio quality, pronunciation, account billing and physical-device microphone/playback have not been verified. Use the Test selected language button and real-speaker acceptance checks before presenting it as fully working.

## Provider references checked 27 September 2026

- https://developers.openai.com/api/docs/guides/text-to-speech
- https://developers.openai.com/api/docs/guides/speech-to-text
- https://docs.sarvam.ai/api-reference/text-to-speech/convert
- https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/how-to/set-the-language
- https://docs.sarvam.ai/api/getting-started/models
