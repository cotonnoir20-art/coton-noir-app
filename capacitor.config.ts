import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5ed19065694d47c6867b6f2d53a8ed43',
  appName: 'coton-noir-app',
  webDir: 'dist',
  server: {
    url: 'https://5ed19065-694d-47c6-867b-6f2d53a8ed43.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;