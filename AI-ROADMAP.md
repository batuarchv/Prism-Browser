# Status after 0.21

Implemented OpenAI page-excerpt summaries and selected-text translation, with review, cancellation and bounded non-streaming results. Gemini, question/explain modes and whole-page DOM replacement remain planned. See RELEASE-0.21.md.

# Prism AI roadmap — proposed, not enabled

Prioritize useful actions without adding an always-running assistant renderer. Keep the current download naming feature; add the following in order.

1. **Ask about this page / selection.** A compact panel offers Summary, Explain, Translate and a question field. Send only explicitly selected readable content, with a source URL and visible context preview. Stream results, support Cancel, and discard context when closed. Start with GPT and Gemini provider adapters. Do not send page content automatically.
2. **Find and organize tabs.** Search titles locally first. Optional AI suggests short folder names or groups for user-selected tabs. Show a preview and Apply/Undo; never close tabs based solely on a model response.
3. **Compare selected pages.** Generate a small comparison with links back to each source. Mark missing evidence rather than inventing answers. Bound the number and length of pages.
4. **Siri actions.** Add a native App Intents bridge for Open favorite, Show downloads and Sleep eligible tabs. Existing Prism URL shortcuts are a starting point, not full Siri integration. Verify App Intent discovery, signing and packaging in a separate macOS proof of concept before promising support.
5. **Writing help.** Context-menu rewrite and translate with a before/after preview. Insert only after a click; never submit messages or forms automatically.

## Architecture and limits

Use one provider interface with streaming, cancellation, timeout and schema validation. OpenAI function calling supports proposed browser actions; execute only allowlisted validated commands in the trusted process. Gemini structured output can return bounded grouping and naming suggestions. Treat web text as untrusted data, never as instructions to browser tools.

Store provider credentials using the existing encrypted-secret approach. Exclude password/payment fields, cookies and Private-space data. No silent switch to cloud processing. Keep the provider and outgoing context visible. Provider API setup must be explicit; do not assume an existing browser sign-in supplies API access.

Use on-device processing where available for short naming tasks. Siri is an action entry point, not an interchangeable text-generation provider. No hidden ChatGPT/Gemini tabs, resident local model or background indexing. Reuse the compact panel, release it when idle, and cap context and output lengths.

## Acceptance checks for implementation

Test cancellation, navigation during a request, invalid JSON, injected page instructions, missing credentials, unavailable local model, offline operation and Private-space exclusion. Verify grouping undo and no network request before the user invokes AI. Measure idle process count and RAM before/after enabling the panel; do not claim zero overhead.

## Official references consulted

- [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling)
- [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [Apple App Intents](https://developer.apple.com/documentation/appintents)

## Translation — explicit next-build feature

Add both **Translate this page** and **Translate selected text**. Offer source-language detection, a target-language picker (including English, Turkish, Spanish, Portuguese, French and Ukrainian), and original/translation switching. Selected text opens a compact popover with Copy; whole-page translation needs a reversible DOM text-node mapping that preserves links, layout and forms. Skip editable fields, hidden text, passwords and payment data. Translate visible content in bounded batches, cancel on navigation, and cache only within the current page session. Show the chosen GPT/Gemini provider and obtain a deliberate user action before sending content; Private stays excluded initially. Test mixed-language pages, right-to-left text, dynamic content and unsupported/offline providers before enabling page replacement.

## Profile and mobile sync

The 0.20 local profile stores only name, email and theme. Connection buttons open existing browser sessions or API/password settings; they are not OAuth account linking. Real mobile sync remains a separate implementation: choose a backend, authenticate and pair devices, then implement encrypted records, conflict resolution, revocation, deletion and explicit data selection. Start with theme and bookmarks. Password vault synchronization needs an independently reviewed end-to-end encryption design; never upload the current Mac-bound encrypted file as a portable vault.
