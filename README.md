# Password & QR Generator

A browser-based utility for generating passwords and QR codes from generated or custom data.

## Features

- Password length validation from 4 to 20 characters
- Optional character groups
- Browser randomness using `crypto.getRandomValues`
- Clipboard copy with graceful fallback messaging
- QR generation from generated passwords or custom data

## Security note

Generated passwords stay in the browser; avoid entering sensitive information into the custom QR field when using a shared device.
