# Southbank Centre App: Blog

## Installation

### Step 0

Check [this app's dependencies](https://github.com/Southbank-Centre/SC-app-blog/blob/master/bower.json) and make sure that you follow the installation instructions for the SC-app-* modules that this one depends on.

### Step 1
Run the following command in your app's root directory.

    $ bower install --save Southbank-Centre/SC-app-blog#n.n.n

Replace n.n.n with the version number of this module that you require. See [the list of releases](https://github.com/Southbank-Centre/SC-app-blog/releases).

*Please don't install without a release number or your app will be unstable.*

### Step 2

Add **SC-app-blog** to the dependency list in **[YourAppName].module.js**

### Step 3
Add the app.blogSingle and app.blogList states to your app:

    .state('app.blogSingle', {
      url: '^/blog/:blogAlias',
      views: {
        '@': {
          templateUrl: 'bower_components/SC-app-blog/release/blogSingleView.html'
        }
      }
    })
    .state('app.blogList', {
      url: '^/blog',
      views: {
        '@': {
          templateUrl: 'bower_components/SC-app-blog/release/blogListView.html'
        }
      }
    })

The URL can be changed to whatever is required, although the parameter *:blogAlias* should remain the same for the page to work.