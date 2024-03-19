/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_DASHBOARD_ENDPOINT: string;
    readonly VITE_APARTMENT_ENDPOINT: string;
    readonly VITE_APARTMENT_UNIT_ENDPOINT: string;
    readonly VITE_DEVICE_ENDPOINT: string;
    readonly VITE_CAR_ENDPOINT: string;
    readonly VITE_SIGNIN_ENDPOINT: string;
    readonly VITE_LOGIN_ENDPOINT: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }