export interface Project {
  slug: string;
  name: string;
  version?: string;
  tagline: string;
  status: 'Operational' | 'In Development' | 'Concluded' | 'Beta';
  accent: string;
  description: string;
  longDescription: string;
  features: string[];
  tech: string[];
  urls: { label: string; url: string }[];
  note?: string;
  progress?: number;
  brand?: Array<{ text: string; accent?: boolean }>;
  repo: 'Private' | 'Public';
  details?: {
    architecture?: string[];
    endpoints?: { method: string; path: string; desc: string }[];
    stackDetails?: { category: string; items: string[] }[];
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  date: string;
  type: string;
  location: string;
  description: string;
  bullets: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  handle?: string;
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

export interface TwitchStatus {
  live: boolean;
  channel: string;
  title: string | null;
  game: string | null;
  viewers: number;
  thumbnail: string | null;
  started_at: string | null;
  user?: TwitchUser | null;
  followers?: number | null;
}

export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string;
    discriminator?: string;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities?: {
    name: string;
    details?: string;
    state?: string;
    emoji?: { name: string };
    application_id?: string;
  }[];
  listening_to_spotify?: boolean;
  spotify?: {
    song: string;
    artist: string;
    album_art_url: string;
    timestamps: { start: number; end: number };
  } | null;
}

export interface AppStatus {
  id: string;
  name: string;
  url: string;
  up: boolean;
  statusCode: number | null;
  responseTimeMs: number | null;
  checkedAt: string;
  error: string | null;
}

export interface VpsStatus {
  up: boolean;
  host?: string;
  port?: number;
  name: string;
  responseTimeMs: number | null;
  checkedAt: string;
  error: string | null;
  statusCode?: number | null;
  data?: {
    system?: {
      hostname?: string;
      platform?: string;
      arch?: string;
      uptimeSeconds?: number;
      cpu?: {
        usagePercent?: number;
        count?: number;
        model?: string;
        loadAverage?: number[];
      };
      memory?: {
        totalGb?: number;
        usedGb?: number;
        freeGb?: number;
        usagePercent?: number;
      };
      disk?: {
        totalGb?: number;
        usedGb?: number;
        freeGb?: number;
        usagePercent?: number;
        mount?: string;
        error?: string;
      };
      timestamp?: string;
    };
    pm2?: Array<{
      name: string;
      pid: number;
      status?: string;
      uptimeSeconds?: number | null;
      restartCount?: number;
      cpuPercent?: number | null;
      memoryMb?: number | null;
    }> | { error?: string; detail?: string };
  } | null;
}

export interface StatusData {
  apps: AppStatus[];
  vps: VpsStatus;
  checkedAt: string | null;
}
