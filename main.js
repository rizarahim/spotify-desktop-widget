const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { loginWithSpotify, refreshAccessToken } = require('./auth');

let win;
let tokens = null;
const tokenPath = path.join(app.getPath('userData'), 'spotify-tokens.json');

function saveTokens() {
  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
}

function loadTokens() {
  if (fs.existsSync(tokenPath)) {
    tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 460,
    height: 130,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    x: 1440,   // adjust based on your screen resolution — see note below
    y: 20,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

ipcMain.handle('spotify-login', async () => {
  tokens = await loginWithSpotify();
  saveTokens();
  return tokens;
});

ipcMain.handle('check-saved-login', () => {
  loadTokens();
  return !!tokens;
});

ipcMain.handle('close-app', () => {
  app.quit();
});

async function ensureFreshToken() {
  if (!tokens) return;
  // naive refresh: just refresh if we don't know expiry state precisely
  // (simplest reliable approach — refresh proactively every call is overkill,
  // so we refresh reactively on 401 instead, see getValidToken below)
}

async function getValidToken() {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  });
  if (res.status === 401) {
    const refreshed = await refreshAccessToken(tokens.refresh_token);
    tokens = { ...tokens, ...refreshed };
    saveTokens();
  }
  return tokens.access_token;
}

ipcMain.handle('get-now-playing', async () => {
  if (!tokens) return null;
  const token = await getValidToken();

  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.status === 204) return null;
  if (!res.ok) return null;
  return res.json();
});

ipcMain.handle('play-pause', async () => {
  if (!tokens) return;
  const token = await getValidToken();

  const nowPlayingRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = nowPlayingRes.status === 200 ? await nowPlayingRes.json() : null;
  const isPlaying = data ? data.is_playing : false;

  const endpoint = isPlaying ? 'pause' : 'play';
  await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  });
});

ipcMain.handle('skip-next', async () => {
  if (!tokens) return;
  const token = await getValidToken();
  await fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
});

ipcMain.handle('skip-previous', async () => {
  if (!tokens) return;
  const token = await getValidToken();
  await fetch('https://api.spotify.com/v1/me/player/previous', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
});

ipcMain.handle('resize-window', (event, width, height) => {
  win.setSize(width, height, true); // true = animate the resize
});

ipcMain.handle('seek-to', async (event, positionMs) => {
  if (!tokens) return;
  const token = await getValidToken();
  await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${Math.floor(positionMs)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  });
});

app.whenReady().then(() => {
  loadTokens();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});