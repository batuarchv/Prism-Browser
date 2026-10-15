# Prism 0.21.5 · local account preview

Profile settings now include a development account manager backed by the separate Prism account service. This is not public cloud sync. No mailbox ownership is verified until a real email delivery adapter is deployed.

- Expiring single-use development sign-in, Keychain-encrypted desktop session.
- Explicit name/theme upload and profile download; revision conflicts prevent silent overwrites.
- Account creation timestamp, device list, session revocation, sign-out, JSON export and account deletion.
- No server process inside Prism, no background account polling. Existing local profile works offline.
- No passwords, cards, history, cookies, AI keys or private browsing transferred.
- Existing logo retained unchanged.

Backend: workspace `services/prism-account`, zero npm dependencies, Node 24+, SQLite, loopback only. Start its `.command` launcher separately. Local preview is in Settings → Profile. The separate server source ZIP includes API documentation and the hosting/iOS roadmap.

Validation: two backend integration scenarios cover account isolation, persistence, expiration, rate limits, single-use codes, profile conflicts and revocation/deletion. Desktop GUI fixture passes sign-in, macOS encrypted token persistence, explicit profile upload/download, device list and sign-out. Panel screenshot reviewed. No public email, internet account or iPhone sync is claimed.
