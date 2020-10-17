module.exports = {
  project: {
    android: {},
  },
  assets: ['./assets/fonts/'],
  dependencies: {
    '@react-native-community/netinfo': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
