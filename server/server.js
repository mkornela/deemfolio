import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import net from 'net';
import dns from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env'),
    path.resolve(__dirname, '../.env'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate });
      return;
    }
  }
  dotenv.config();
}

loadEnv();

const app = express();
const PORT = Number(process.env.PORT) || 4569;

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '';
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || '';

let twitchToken = {
  access_token: null,
  expires_at: 0,
};

async function getTwitchAppToken() {
  const now = Date.now();
  if (twitchToken.access_token && twitchToken.expires_at > now + 60_000) {
    return twitchToken.access_token;
  }

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
    throw new Error('Twitch credentials not configured');
  }

  const params = new URLSearchParams();
  params.append('client_id', TWITCH_CLIENT_ID);
  params.append('client_secret', TWITCH_CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: params,
  });

  if (!res.ok) {
    throw new Error(`Twitch token exchange failed: ${res.status}`);
  }

  const data = await res.json();
  twitchToken.access_token = data.access_token;
  twitchToken.expires_at = now + (data.expires_in || 0) * 1000;
  return data.access_token;
}

async function fetchHelix(path, params = {}) {
  const token = await getTwitchAppToken();
  const url = new URL(`https://api.twitch.tv/helix/${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Helix ${path} request failed: ${res.status}`);
  }

  return res.json();
}

async function fetchUser(login) {
  const data = await fetchHelix('users', { login: login.toLowerCase() });
  const user = data.data && data.data[0] ? data.data[0] : null;
  if (!user) return null;
  return {
    id: user.id,
    login: user.login,
    display_name: user.display_name,
    profile_image_url: user.profile_image_url,
  };
}

async function fetchFollowers(broadcasterId) {
  try {
    const data = await fetchHelix('channels/followers', { broadcaster_id: broadcasterId });
    return typeof data.total === 'number' ? data.total : null;
  } catch (err) {
    return null;
  }
}

async function fetchStreamStatus(channel) {
  const user = await fetchUser(channel);
  const data = await fetchHelix('streams', { user_login: channel.toLowerCase() });
  const stream = data.data && data.data[0] ? data.data[0] : null;
  const followers = user ? await fetchFollowers(user.id) : null;

  let result;

  if (!stream) {
    result = {
      live: false,
      channel,
      title: null,
      game: null,
      viewers: 0,
      thumbnail: null,
      started_at: null,
      user,
      followers,
    };
  } else {
    result = {
      live: true,
      channel,
      title: stream.title,
      game: stream.game_name,
      viewers: stream.viewer_count,
      thumbnail: stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'),
      started_at: stream.started_at,
      user,
      followers,
    };
  }

  recordViewerSample(channel, result.live, result.viewers);
  return result;
}

const STATUS_APPS = parseStatusApps(process.env.STATUS_APPS);
const VPS_HOST = normalizeVpsHost(process.env.VPS_HOST || '');
const VPS_IPV4 = process.env.VPS_IPV4 || '';
const VPS_PORT = Number(process.env.VPS_PORT) || 22;
const VPS_NAME = process.env.VPS_NAME || 'VPS';
const VPS_HEALTH_URL = process.env.VPS_HEALTH_URL || '';
const STATUS_POLL_MS = 30_000;

const MAX_VIEWER_SAMPLES = 200;
const viewerHistory = new Map();

function recordViewerSample(channel, live, viewers) {
  const key = channel.toLowerCase();
  if (!viewerHistory.has(key)) {
    viewerHistory.set(key, []);
  }
  const samples = viewerHistory.get(key);
  samples.push({ viewers: live ? viewers : 0, timestamp: Date.now(), live });
  if (samples.length > MAX_VIEWER_SAMPLES) {
    samples.splice(0, samples.length - MAX_VIEWER_SAMPLES);
  }
}

function getAverageViewers(channel) {
  const key = channel.toLowerCase();
  const samples = viewerHistory.get(key);
  if (!samples || samples.length === 0) return 0;
  const liveSamples = samples.filter((s) => s.live && s.viewers > 0);
  if (liveSamples.length === 0) return 0;
  const sum = liveSamples.reduce((acc, s) => acc + s.viewers, 0);
  return Math.round(sum / liveSamples.length);
}

function parseStatusApps(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
  }
  return [];
}

function maskHost(host) {
  if (!host) return host;
  if (net.isIPv4(host)) {
    const parts = host.split('.');
    return `${parts[0]}.${parts[1]}.*.*`;
  }
  if (net.isIPv6(host)) {
    const idx = host.lastIndexOf(':');
    return idx > 0 ? `${host.slice(0, idx + 1)}****` : '****';
  }
  return host;
}

function sanitizeError(error) {
  if (!error) return error;
  return error
    .replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, '')
    .replace(/\b(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\b/g, '')
    .replace(/\s*:\d+\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const statusCache = {
  apps: [],
  vps: { up: false, port: VPS_PORT, name: VPS_NAME, responseTimeMs: null, checkedAt: null, error: null },
  checkedAt: null,
};

async function checkHttpApp(appConfig) {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(appConfig.url, {
      method: appConfig.method || 'GET',
      signal: controller.signal,
      headers: appConfig.headers || {},
    });
    clearTimeout(timeout);
    const responseTimeMs = Date.now() - start;
    let body = null;
    try {
      const text = await res.text();
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }
    return {
      id: appConfig.id,
      name: appConfig.name,
      url: appConfig.url,
      up: res.ok,
      statusCode: res.status,
      responseTimeMs,
      body,
      checkedAt: new Date().toISOString(),
      error: res.ok ? null : `HTTP ${res.status}`,
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      id: appConfig.id,
      name: appConfig.name,
      url: appConfig.url,
      up: false,
      statusCode: null,
      responseTimeMs: Date.now() - start,
      body: null,
      checkedAt: new Date().toISOString(),
      error: err.name === 'AbortError' ? 'Timeout' : err.message,
    };
  }
}

function isIpv6Literal(host) {
  return net.isIPv6(host);
}

function normalizeVpsHost(host) {
  if (!host) return host;
  return host.replace(/^\[/, '').replace(/\]$/, '');
}

function tryConnect(host, port) {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    socket.setTimeout(10_000);

    const done = (up, error) => {
      try { socket.destroy(); } catch {}
      resolve({ up, responseTimeMs: Date.now() - start, error });
    };

    socket.once('connect', () => done(true, null));
    socket.once('timeout', () => done(false, 'Timeout'));
    socket.once('error', (err) => done(false, err.message));

    socket.connect(port, host);
  });
}

async function checkTcp(host, port) {
  if (isIpv6Literal(host) || net.isIPv4(host)) {
    return tryConnect(host, port);
  }

  try {
    const addresses = await dns.promises.lookup(host, { all: true });
    const v6 = addresses.filter((a) => a.family === 6);
    const v4 = addresses.filter((a) => a.family === 4);

    for (const addr of [...v6, ...v4]) {
      const result = await tryConnect(addr.address, port);
      if (result.up) return result;
    }

    const last = await tryConnect(v6[0]?.address || v4[0]?.address || host, port);
    return last;
  } catch {
    return tryConnect(host, port);
  }
}

async function resolveVpsHost(host) {
  if (!host) return host;
  if (isIpv6Literal(host) || net.isIPv4(host)) return host;

  try {
    const addresses = await dns.promises.lookup(host, { all: true });
    const v6 = addresses.find((a) => a.family === 6);
    const v4 = addresses.find((a) => a.family === 4);
    return v6 ? v6.address : v4 ? v4.address : host;
  } catch {
    return host;
  }
}

async function checkVps() {
  if (!VPS_HOST && !VPS_IPV4 && !VPS_HEALTH_URL) {
    return { up: false, port: VPS_PORT, name: VPS_NAME, responseTimeMs: null, checkedAt: new Date().toISOString(), error: 'Not configured' };
  }

  let result = { up: false, port: VPS_PORT, name: VPS_NAME, responseTimeMs: null, checkedAt: new Date().toISOString(), error: null };

  if (VPS_HEALTH_URL) {
    const http = await checkHttpApp({ id: 'vps', name: VPS_NAME, url: VPS_HEALTH_URL });
    result = {
      ...result,
      up: http.up,
      responseTimeMs: http.responseTimeMs,
      error: sanitizeError(http.error),
      statusCode: http.statusCode,
      data: http.up && http.body && typeof http.body === 'object' ? http.body : null,
    };
    return result;
  }

  if (VPS_HOST) {
    const resolvedHost = await resolveVpsHost(VPS_HOST);
    const tcp = await checkTcp(resolvedHost, VPS_PORT);
    if (tcp.up) {
      return { ...result, up: true, responseTimeMs: tcp.responseTimeMs };
    }
    result = { ...result, responseTimeMs: tcp.responseTimeMs, error: sanitizeError(tcp.error) };
  }

  if (VPS_IPV4) {
    const tcp = await checkTcp(VPS_IPV4, VPS_PORT);
    if (tcp.up) {
      return { ...result, up: true, responseTimeMs: tcp.responseTimeMs, error: null };
    }
    result = { ...result, responseTimeMs: tcp.responseTimeMs, error: sanitizeError(tcp.error || result.error) };
  }

  return result;
}

async function refreshStatus() {
  const apps = await Promise.all(STATUS_APPS.map(checkHttpApp));
  const vps = await checkVps();
  statusCache.apps = apps;
  statusCache.vps = vps;
  statusCache.checkedAt = new Date().toISOString();
}

if (STATUS_APPS.length > 0 || VPS_HOST || VPS_HEALTH_URL) {
  refreshStatus();
  setInterval(refreshStatus, STATUS_POLL_MS);
}

app.get('/api/status', (_req, res) => {
  res.json(statusCache);
});

app.get('/api/status/apps', (_req, res) => {
  res.json({ apps: statusCache.apps, checkedAt: statusCache.checkedAt });
});

app.get('/api/status/vps', (_req, res) => {
  res.json({ vps: statusCache.vps, checkedAt: statusCache.checkedAt });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/api/twitch/users', async (req, res) => {
  const login = req.query.login;
  if (!login || typeof login !== 'string') {
    return res.status(400).json({ error: 'Missing ?login=' });
  }

  try {
    const user = await fetchUser(login);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Twitch users error:', err.message);
    res.status(502).json({ error: 'Unable to fetch Twitch user', details: err.message });
  }
});

app.get('/api/twitch/status', async (req, res) => {
  const channel = req.query.channel;
  if (!channel || typeof channel !== 'string') {
    return res.status(400).json({ error: 'Missing ?channel=' });
  }

  try {
    const status = await fetchStreamStatus(channel);
    res.json(status);
  } catch (err) {
    console.error('Twitch status error:', err.message);
    res.status(502).json({ error: 'Unable to fetch Twitch status', details: err.message });
  }
});

app.get('/api/twitch/status/batch', async (req, res) => {
  const channelsParam = req.query.channels;
  if (!channelsParam || typeof channelsParam !== 'string') {
    return res.status(400).json({ error: 'Missing ?channels=a,b,c' });
  }

  const channels = channelsParam.split(',').map((c) => c.trim()).filter(Boolean);
  if (channels.length === 0) {
    return res.status(400).json({ error: 'No channels provided' });
  }

  try {
    const results = await Promise.all(channels.map(fetchStreamStatus));
    const map = Object.fromEntries(results.map((r) => [r.channel, r]));
    res.json(map);
  } catch (err) {
    console.error('Twitch batch error:', err.message);
    res.status(502).json({ error: 'Unable to fetch Twitch statuses', details: err.message });
  }
});

app.get('/api/twitch/average-viewers', async (req, res) => {
  const channelsParam = req.query.channels;
  if (!channelsParam || typeof channelsParam !== 'string') {
    return res.status(400).json({ error: 'Missing ?channels=a,b,c' });
  }

  const channels = channelsParam.split(',').map((c) => c.trim()).filter(Boolean);
  if (channels.length === 0) {
    return res.status(400).json({ error: 'No channels provided' });
  }

  try {
    Promise.allSettled(channels.map(fetchStreamStatus)).catch(() => {});

    const avgs = Object.fromEntries(
      channels.map((c) => [c, getAverageViewers(c)])
    );
    res.json(avgs);
  } catch (err) {
    console.error('Twitch average-viewers error:', err.message);
    res.status(502).json({ error: 'Unable to fetch average viewers', details: err.message });
  }
});

const distPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`deemfolio server listening on http://localhost:${PORT}`);
});
