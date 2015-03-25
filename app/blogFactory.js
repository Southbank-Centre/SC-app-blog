'use strict';

/**
 * @ngdoc service
 * @name SC-app-blog.factory:blogFactory
 * @factory
 *
 * @description
 * Factory for loading blog data
 */

angular.module('SC-app-blog')
  .factory('blogFactory', function($http, $rootScope, utilitiesFactory, appConfig) {

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

    });