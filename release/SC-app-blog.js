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
  ]);;'use strict';

/**
 * @ngdoc controller
 * @name SC-app-blog.controller:BlogSingleCtrl
 * @controller
 *
 * @description
 * Defines the state and behaviour of the $scope for the blogSingleView state
 */

angular.module('SC-app-blog')
  .controller('BlogListCtrl', ["$rootScope", "$scope", "blogFactory", "utilitiesFactory", function ($rootScope, $scope, blogFactory, utilitiesFactory) {

    // Get a listing of blog posts and bind them to the scope.
    blogFactory.getBlogList(function(data) {

      $scope.blogItems = data.list;

    }, utilitiesFactory.genericHTTPCallbackError);

  }]);;'use strict';

/**
 * @ngdoc controller
 * @name SC-app-blog.controller:BlogSingleCtrl
 * @controller
 *
 * @description
 * Defines the state and behaviour of the $scope for the blogSingleView state
 */

angular.module('SC-app-blog')
  .controller('BlogSingleCtrl', ["$rootScope", "$scope", "$stateParams", "$location", "blogFactory", "utilitiesFactory", "appConfig", function ($rootScope, $scope, $stateParams, $location, blogFactory, utilitiesFactory, appConfig) {

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
      var disqusShortname = appConfig.disqus_shortname;

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
      else if(host === appConfig.hostName) {
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

  }]);;'use strict';

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
  .directive('scBlogSimplePager', function() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        previousBlogPost: '=previousBlogPost',
        nextBlogPost: '='
      },
      templateUrl: 'bower_components/SC-app-blog/release/blogSimplePagerView.html'
    };

  });;'use strict';

/**
 * @ngdoc service
 * @name SC-app-blog.factory:blogFactory
 * @factory
 *
 * @description
 * Factory for loading blog data
 */

angular.module('SC-app-blog')
  .factory('blogFactory', ["$http", "$rootScope", "utilitiesFactory", "appConfig", function($http, $rootScope, utilitiesFactory, appConfig) {

      return {

        /**
         * @ngdoc method
         * @methodOf SC-app-blog.factory:blogFactory
         * @name SC-app-blog.factory:blogFactory#getBlogSingle
         * @returns {undefined} Undefined
         * @param {string} blogAlias The Alias of the blog post
         * @param {function} callbackSuccess The function to call when the HTTP request succeeds
         * @param {function} callbackError The function to call when the HTTP request fails
         *
         * @description
         * For getting data for a single blog post by post ID
         */
        getBlogSingle: function(blogAlias, callbackSuccess, callbackError) {

          $http.get('/json/api/blog-post/' + blogAlias)
            .success(function(blogPost) {

              // Correct date format for start and end dates
              if (blogPost.field_published_date) {
                blogPost.field_published_date = utilitiesFactory.timestampSecondsToMS(blogPost.field_published_date);
              }

              callbackSuccess(blogPost);
            })
          // .error(callbackError);
            .error(callbackError);
        },

        /**
         * @ngdoc method
         * @methodOf SC-app-blog.factory:blogFactory
         * @name SC-app-blog.factory:blogFactory#getBlogList
         * @returns {undefined} undefined
         * @param {function} callbackSuccess The function to call when the HTTP request succeeds.
         * @param {function} callbackError The function to call when the HTTP request fails.
         *
         * @description
         * Get a list of published blog posts sorted by the value in the published_date field.
         */
        getBlogList: function(callbackSuccess, callbackError) {

          var reqUrl = '/json/node.json?type=blog_post&status=1&sort=field_published_date&direction=DESC';

          // Add the 'field_festival' filter if a festival has been defined
          if (appConfig.festivalId) {
            reqUrl = reqUrl + '&field_festival=' + appConfig.festivalId;
          }

          $http.get(reqUrl)
            .success(function(blogListing) {

              angular.forEach(blogListing.list, function(blogItem){
                if (blogItem.field_published_date) {
                  blogItem.field_published_date = utilitiesFactory.timestampSecondsToMS(blogItem.field_published_date);
                }
              });

              callbackSuccess(blogListing);
            })
            .error(callbackError);
        }

      };

    }]);