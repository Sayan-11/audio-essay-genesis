
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c1ae41c0cfd64fe0822b2585d280e889',
  appName: 'OpenPod',
  webDir: 'dist',
  server: {
    url: "https://c1ae41c0-cfd6-4fe0-822b-2585d280e889.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#10B981",
      showSpinner: true,
      spinnerColor: "#ffffff",
    }
  }
};

export default config;
