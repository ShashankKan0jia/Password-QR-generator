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
Generated passwords are created in the browser, but QR generation uses the external QRServer API. Data placed in the QR field is sent to that third-party service to create the QR image, so do not enter sensitive information you do not want to share with that service.

## Scope
The project keeps password generation in the browser and does not provide server-side password storage. QR creation relies on the external QRServer service.
