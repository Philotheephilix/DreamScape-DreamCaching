/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TWITTER_API_KEY: string;
    readonly VITE_TWITTER_API_SECRET: string;
    readonly VITE_TWITTER_CALLBACK_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }