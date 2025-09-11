import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5ed19065694d47c6867b6f2d53a8ed43',
  appName: 'Coton Noir',
  webDir: 'dist',
  // Retirer server config pour production
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false
    }
  }
};

export default config;