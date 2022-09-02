const CracoLess = require("craco-less");
const CracoAntDesignPlugin = require("craco-antd");
const path = require("path");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackBar = require('webpackbar');

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    plugins: [
      // new BundleAnalyzerPlugin({
      //   analyzerMode: "server",
      //   analyzerHost: "127.0.0.1",
      //   analyzerPort: 8888,
      //   openAnalyzer: true, // 构建完打开浏览器
      //   reportFilename: path.resolve(__dirname, `analyzer/index.html`),
      // }),
      new WebpackBar({
        profile: true,
        color: "#1DA57A",
      }),
    ],
    configure: (webpackConfig, { env: webpackEnv, paths }) => {
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        cacheGroups: {
          base: {
            // 基本框架
            chunks: "all",
            test: /(react|react-dom|react-router-dom|react-redux)/,
            name: "base",
            priority: 100,
          },
          commons: {
            chunks: "all",
            // 将两个以上的chunk所共享的模块打包至commons组。
            minChunks: 2,
            name: "commons",
            priority: 80,
          },
        },
      };
      return webpackConfig;
    },
  },
  plugins: [
    // 针对Less的相关配置（如module样式）
    {
      plugin: CracoLess,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        modifyLessRule: function () {
          return {
            test: /\.module\.less$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: "[local]_[hash:base64:6]",
                  },
                },
              },
              {
                loader: "less-loader",
              },
            ],
          };
        },
      },
    },
    {
      plugin: CracoAntDesignPlugin,
      options: {
        // customizeTheme: {
        //   '@primary-color': '#1DA57A',
        // },
        customizeThemeLessPath: path.join(__dirname, "src/antd.customize.less"),
      },
    },
  ],
};
