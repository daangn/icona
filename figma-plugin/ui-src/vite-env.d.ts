/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_JUNE_SO_WRITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
