'use strict';

/**
 * @ngdoc controller
 * @name SC-app-blog.controller:BlogSingleCtrl
 * @controller
 *
 * @description
 * Defines the state and behaviour of the $scope for the blogSingleView state
 */

angular.module('SC-app-blog')
  .controller('BlogListCtrl', function ($rootScope, $scope, blogFactory, utilitiesFactory) {

    // Get a listing of blog posts and bind them to the scope.
    blogFactory.getBlogList(function(data) {

      $scope.blogItems = data.list;

    }, utilitiesFactory.genericHTTPCallbackError);

  });