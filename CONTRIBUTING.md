# Contributing to Prism

Thanks for taking an interest in Prism. It is an experimental macOS browser project; focused issues, careful bug reports, and small pull requests are welcome.

## Development setup

Use macOS on Apple Silicon, Node.js 22 or newer, pnpm, and Xcode Command Line Tools.

```sh
pnpm install
pnpm run prepare:extensions
pnpm start
```

When changing the AppKit bridge, rebuild it with `pnpm run build:native`. The optional Swift helper can be rebuilt with `pnpm run build:ai` when the macOS 26 SDK is available.

## Pull requests

- Explain the problem and the user-visible change.
- Keep changes focused and update the README when behavior or limitations change.
- Do not include browser profiles, credentials, local logs, personal browsing data, or screenshots containing signed-in content.
- Never commit API keys, signing keys, certificates, or tokens.

## Scope

Prism is currently an Apple Silicon macOS prototype. Extension compatibility is best effort. Changes should preserve Private session isolation, explicit user consent for credential filling, and Chromium's web security settings.
