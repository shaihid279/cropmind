import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kisanscan.app',
  appName: 'KisanScan',
  webDir: 'out',
  server: {
    url: 'https://cropmind-six.vercel.app',
    cleartext: true
  }
};

export default config; 