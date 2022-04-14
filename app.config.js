import 'dotenv/config';

export default {
  expo: {
    name: 'CHO-MATE',
    slug: 'CHO-MATE',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './app/assets/icon-chomate.png',
    splash: {
      image: './app/assets/chomate-splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.chomate.chomate',
      supportsTablet: true,
    },
    android: {
      package: 'com.chomate.chomate',
      adaptiveIcon: {
        foregroundImage: './app/assets/icon-chomate.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './app/assets/favicon.png',
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
};
