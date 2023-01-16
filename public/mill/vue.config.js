const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync('./certs/example.com+5-key.pem'),
        cert: fs.readFileSync('./certs/example.com+5.pem'),
      },
    },
  },
  publicPath: './',
  pwa: {
    title: 'Mill',
    name: 'Mill',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    mobileWebAppCapable: 'yes',
    mobileWebAppCache: 'yes',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: '/index.html',
      skipWaiting: true,
      clientsClaim: true,
      exclude: [/_redirect/, /\.map$/, /_headers/],
    },
    manifestOptions: {
      name: 'Mill',
      short_name: 'Mill',
      start_url: '.',
      display: 'fullscreen',
    },
    iconPaths: {
      faviconSVG: 'img/icons/safari-pinned-tab.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
  },
});
