const crypto = require('crypto');
const http = require('http');
const { shell } = require('electron');

const CLIENT_ID = '0a0d87b139514c31b700aa1f4fe802a3';
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPES = 'user-read-currently-playing user-read-playback-state user-modify-playback-state';

function base64URLEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest();
}

// This runs the whole login flow and resolves with { access_token, refresh_token }
function loginWithSpotify() {
  return new Promise((resolve, reject) => {
    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    const codeChallenge = base64URLEncode(sha256(codeVerifier));

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}` +
      `&scope=${encodeURIComponent(SCOPES)}`;

    // Spin up a tiny local server just to catch the redirect
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith('/callback')) {
        const url = new URL(req.url, REDIRECT_URI);
        const code = url.searchParams.get('code');

        res.end('<h2>Logged in! You can close this tab and go back to the widget.</h2>');
        server.close();

        try {
          const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: CLIENT_ID,
              grant_type: 'authorization_code',
              code,
              redirect_uri: REDIRECT_URI,
              code_verifier: codeVerifier
            })
          });
          const tokenData = await tokenRes.json();
          resolve(tokenData); // { access_token, refresh_token, expires_in, ... }
        } catch (err) {
          reject(err);
        }
      }
    });

    server.listen(8888, () => {
      shell.openExternal(authUrl); // opens your default browser
    });
  });
}

async function refreshAccessToken(refreshToken) {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });
  return res.json(); // { access_token, expires_in, ... } — refresh_token may or may not be reissued
}

module.exports = { loginWithSpotify, refreshAccessToken };
