module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Reanimated 4 는 worklets 플러그인이 필요하며 반드시 plugins 의 마지막이어야 함.
    plugins: ["react-native-worklets/plugin"],
  };
};
