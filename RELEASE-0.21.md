# Prism 0.21 — page assistance

Open View → Page assistant (also in Settings). Choose a page excerpt or selected text, an action and output language. Preview context before pressing Send to OpenAI. Selected-text translation supports English, Turkish, Spanish, Portuguese, French and Ukrainian. Results are plain selectable text with Copy; the source page is unchanged.

Uses the existing encrypted OpenAI API key and gpt-4.1-mini through the Responses API. API access is separate from ChatGPT sign-in. Download naming retains its independently selected provider. Page assistance currently supports OpenAI only. Gemini, on-device summaries, streaming and reversible full-page translation are deferred.

Only a bounded preview (12,000 characters) and site origin are sent, after explicit Send. Query strings, cookies, form controls, editable areas, hidden content, frames and shadow DOM are excluded from extraction. Visible article text can still contain personal information: the preview shows the exact text to review. Private is disabled. Navigation, tab/space changes, panel dismissal and Cancel invalidate context; requests have a 30-second timeout and bounded responses. No browser tools, automatic actions, new background renderer, indexing or persisted assistant history are added. The existing panel is released after its idle timeout. No measured RAM reduction is claimed.

## Validation

Six assistant unit tests plus seven existing AI/wallet tests passed. They cover no request before Send, bounded context/origin, missing key, invalid language/action, malformed/incomplete/oversized response, cancellation, stale navigation, Private exclusion and existing naming behavior. Focused disposable-profile Electron checks passed for real DOM filtering, exact selection, preview/clear UI and Private rejection; the panel screenshot was reviewed. No real API key or cloud response was used, so provider account access and live result quality remain unverified.

Current user icon retained. Apple Silicon package is ad-hoc signed; update publishing remains unconfigured. The installed application is not replaced automatically.

API reference used: https://developers.openai.com/api/docs/guides/text
