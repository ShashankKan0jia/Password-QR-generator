# Password & QR Generator

A browser-based utility for generating passwords and QR codes from generated or custom data.

## Features
- Password length validation from 4–20 characters
- Optional character groups
- Browser randomness using `crypto.getRandomValues`
- Clipboard copy with fallback messaging
- QR generation from generated passwords or custom data
- Keyboard-friendly controls and accessible status messaging

## Security note
Generated passwords stay in the browser. Avoid entering sensitive information into the custom QR field on shared devices.

## Scope
The project keeps password generation and QR creation client-side and does not provide server-side password storage.