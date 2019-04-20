/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-env node */

module.exports = {
  staticFileGlobs: [
    'bower_components/webcomponentsjs/webcomponents-loader.js',
    'node_modules/mapbox-gl/dist/mapbox-gl.js',
    'node_modules/mapbox-gl/dist/mapbox-gl.css',
    'bower_components/font-roboto/fonts/roboto/Roboto-Bold.ttf',
    'bower_components/font-roboto/fonts/roboto/Roboto-Italic.ttf',
    'bower_components/font-roboto/fonts/roboto/Roboto-Regular.ttf',
    'images/*',
    'manifest.json',
    '/index.html'
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^\/map*/, /^\/about\/*/, /^\/impressum\/*/],
  runtimeCaching: [
    {
      urlPattern: /\/bower_components\/webcomponentsjs\/.*.js/,
      handler: 'fastest',
      options: {
        cache: {
          name: 'webcomponentsjs-polyfills-cache',
        },
      },
    },
    {
      urlPattern: /^https:\/\/api.mapbox.com\/styles\/v1\/wiem008\/cjeyaic6a41sc2sl17vg8aogk\/sprite/,
      handler: 'cacheFirst',
    },
    {
      urlPattern: /^https:\/\/api.mapbox.com\/fonts\/v1\/wiem008/,
      handler: 'cacheFirst',
    },
    {
      urlPattern: /\/(\d+)\/(\d+)\/(\d+).vector.pbf/,
      handler: 'cacheFirst',
    },
  ],
};
