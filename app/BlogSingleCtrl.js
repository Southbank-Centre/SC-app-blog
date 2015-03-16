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
  .controller('BlogSingleCtrl', function ($rootScope, $scope, $stateParams, $location, blogFactory, utilitiesFactory) {

    // Prevent the diqus directive from trying to load the comments until the page has fully loaded
    $scope.disqus = {
      blogLoaded : false
    };

    /**
     * Method for getting one event from the API
     */
    blogFactory.getBlogSingle($stateParams.blogAlias, function(data) {

      // SUCCESS
      // Attach the blog data to the scope
      $scope.blogPost = data;

      // Disqus setup
      // Get the disqus shortname string
      var disqusShortname = $rootScope.disqus_shortname;

      // Check the hostname so that we can load comments for the correct environment
      var host = $location.host();

      // Check the hostname to ensure that the Disqus directive will load the correct comment stream.
      // This will prevent comments entered on a testing environment from loading on a live blog page.
      if(host.indexOf('dev') === 0) {
        $scope.disqus.shortname = 'dev' + disqusShortname;
      }
      else if(host.indexOf('staging') === 0) {
        $scope.disqus.shortname = 'staging' + disqusShortname;
      }
      // live
      else if(host === $rootScope.hostName) {
        $scope.disqus.shortname = disqusShortname;
      }

      // Set the Disqus unique identifier to the nid of the blog post.
      // This will be used to load the commetns stream in the first instance followed by the url property
      $scope.disqus.identifier = data.nid;
      $scope.disqus.url = $location.absUrl();

      // Build a title for the Disqus comment stream. This will default to the page title tag or the URL.
      // Use the blog post h1 title
      $scope.disqus.title = data.title;

      // Tell the disqus directive to load
      $scope.disqus.blogLoaded = true;

    }, utilitiesFactory.genericHTTPCallbackError);

  });