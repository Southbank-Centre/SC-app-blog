'use strict';

angular.module('SC-app-blog')
  /**
   * @ngdoc directive
   * @name SC-app-blog.directive:scBlogSimplePager
   * @directive
   *
   * @description
   * Renders blog simple pager element using it's relevant template
   *
   */  
  .directive('scBlogSimplePager', function($http) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        previousBlogPost: '=previousBlogPost',
        nextBlogPost: '='
      },
      templateUrl: 'bower_components/SC-app-blog/release/blogSimplePagerView.html'
    };

  });