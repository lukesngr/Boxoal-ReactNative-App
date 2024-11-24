module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    // This line is crucial - it mocks ALL image files
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/assetMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-redux|@react-native|@react-navigation|react-native-paper)/)',
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
