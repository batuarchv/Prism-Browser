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

## Signed releases

`node scripts/release-local.cjs --dmg` signs with a **Developer ID Application** certificate when one is in the keychain, then notarizes and staples both the app and the DMG, so downloads open without the "can't be opened" warning. Without a certificate it falls back to ad-hoc signing. One-time setup on the release Mac:

1. Join the Apple Developer Program and create a *Developer ID Application* certificate (Xcode → Settings → Accounts → Manage Certificates, or developer.apple.com → Certificates).
2. Create an app-specific password at account.apple.com, then store it for notarytool:
   `xcrun notarytool store-credentials prism-notary --apple-id <email> --team-id <TEAMID> --password <app-specific password>`
3. Check the setup with `node scripts/sign-mac.cjs --check`.

Credentials stay in the macOS keychain; set `PRISM_SIGN_IDENTITY` or `PRISM_NOTARY_PROFILE` to use a different certificate or profile.

## Scope

Prism is currently an Apple Silicon macOS prototype. Extension compatibility is best effort. Changes should preserve Private session isolation, explicit user consent for credential filling, and Chromium's web security settings.
