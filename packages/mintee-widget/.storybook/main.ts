const path = require("path");
const webpack = require("webpack");

module.exports = {
  stories: ["../src/**/**/*.stories.mdx", "../src/**/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"
    // "@storybook/preset-scss",
    , "@storybook/addon-mdx-gfm"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },


  webpackFinal: async (config, {
    configType
  }) => {
    // get index of css rule
    const ruleCssIndex = config.module.rules.findIndex(rule => rule.test.toString() === "/\\.css$/");

    // map over the 'use' array of the css rule and set the 'module' option to true
    config.module.rules[ruleCssIndex].use.map(item => {
      if (item.loader && item.loader.includes("/css-loader/")) {
        item.options.modules = {
          mode: "local",
          localIdentName: configType === "PRODUCTION" ? "[local]__[hash:base64:5]" : "[name]__[local]__[hash:base64:5]"
        };
      }
      return item;
    });

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    config.resolve.fallback = {

      http: false,
      https: false,
      os: false,
      browser: false,
      stream: false,

    };

    return config;
  },
  docs: {
    autodocs: true
  }
};