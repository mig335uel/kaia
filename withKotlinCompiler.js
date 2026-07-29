const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withKotlinCompiler(config, version) {
  return withProjectBuildGradle(config, async (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /classpath\('org\.jetbrains\.kotlin:kotlin-gradle-plugin'\)/,
      `classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${version}")`
    );
    return config;
  });
};
