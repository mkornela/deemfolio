/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_USER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
