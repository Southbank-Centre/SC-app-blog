'use strict';

/**
 * @ngdoc overview
 * @name SC-app-blog
 * @description
 *
 * Provides the app with the ability to display blog content and features
 */
angular
  .module('SC-app-blog', [
    'angularUtils.directives.dirDisqus',
    'SC-app-utils',
    'SC-app-content-components'
  ]);