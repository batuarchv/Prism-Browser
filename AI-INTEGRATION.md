# AI & assistants

## Name a download

Since 0.18, new completed downloads are automatically named by the selected provider. Disable this in AI settings if desired. Old files are not renamed; Private downloads are excluded. On provider failure, the original name stays. Manual suggestions remain available in the full Downloads settings panel.

In Settings → AI & assistants, select Apple Intelligence and check availability. On a supported Mac with Apple Intelligence enabled, open Downloads, choose Rename with AI on a completed file, edit the suggestion if desired, and Apply. Naming runs on-device and does not load a background model on browser startup. The helper exits after the request.

Alternatively choose OpenAI and enter your own API key. API billing/access is separate from ChatGPT. Prism uses the Responses API with GPT-4.1 mini, structured output and `store:false`. This is a request to OpenAI, not a claim of zero retention. It sends the filename, file type and source page title only when requested. Keys are encrypted through macOS-backed Electron safeStorage and are never exposed in app state. There is no silent fallback from Apple Intelligence to a cloud provider.

Manual suggestions rename after Apply; new downloads use automatic naming while enabled. Names are sanitized, the original extension is retained, and an existing target file causes a refusal. The rename uses an exclusive hard link followed by unlink on the same filesystem; unsupported filesystems may refuse it rather than overwrite anything. Private downloads cannot use AI naming.

## ChatGPT and Siri

Open ChatGPT in AI settings creates a normal Personal browser tab. It does not read or send the current page.

After placing Prism.app in Applications, create a shortcut in Apple's Shortcuts app using **Open URLs** with one of:

- `prism://downloads` — open Prism's download panel.
- `prism://chatgpt` — open ChatGPT in a Personal tab.
- `prism://new-tab` — create a Personal tab.

Name the shortcut, then ask Siri to run that name. These actions do not transmit page contents or implement a conversational Siri assistant. Only those three fixed addresses are accepted; arbitrary commands, query parameters and credential-fill actions are excluded.

## Implementation references

- [Apple Foundation Models](https://developer.apple.com/documentation/foundationmodels)
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses)
- [GPT-4.1 mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini)
- [Electron HTML fullscreen events](https://www.electronjs.org/docs/latest/api/web-contents#event-enter-html-full-screen)

## Next compatibility work

Use local fixtures to extend autofill to supported embedded forms and more field types; do not weaken exact-origin checks. Add real provider testing only with an explicitly configured key. Verify Siri voice shortcuts on the installed signed distribution. Keep AI optional, request-driven and off in Private. Continue measuring UI latency and renderer lifetime instead of claiming universal RAM savings.
