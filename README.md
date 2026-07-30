# Spotify Desktop Widget

A frameless, always-on-top Spotify now-playing widget for Windows, built with Electron.

## Features
- Live now-playing track, artist, and album art
- Spinning vinyl animation synced to playback state
- Play / pause / skip controls
- Seekable progress bar
- Switchable themes (vinyl / blur card)
- Minimize and close controls
- Global shortcut (`Ctrl+Alt+S`) to minimize/restore from anywhere
- Persistent login (Spotify PKCE auth)

## Setup
1. Clone the repo
2. `npm install`
3. Create a Spotify app at [developer.spotify.com](https://developer.spotify.com/dashboard), set redirect URI to `http://127.0.0.1:8888/callback`
4. Paste your Client ID into `auth.js`
5. `npm start`