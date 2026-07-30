const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('spotifyAPI', {
  login: () => ipcRenderer.invoke('spotify-login'),
  checkSavedLogin: () => ipcRenderer.invoke('check-saved-login'),
  getNowPlaying: () => ipcRenderer.invoke('get-now-playing'),
  playPause: () => ipcRenderer.invoke('play-pause'),
  skipNext: () => ipcRenderer.invoke('skip-next'),
  skipPrevious: () => ipcRenderer.invoke('skip-previous'),
  closeApp: () => ipcRenderer.invoke('close-app')
});