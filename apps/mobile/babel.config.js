module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@placewise/shared": "../../packages/shared/src/index.ts",
          },
        },
      ],
    ],
  };
};
