angular
    // Injecting into our app module
    .module('bltDocs')

    // Creating an Angular constant and rendering a list of items as JSON
    .constant('HOME_DATA', [
  {
    "name": "Home",
    "type": "content",
    "template": "partials/home.html",
    "path": "",
    "order": 100
  },
  {
    "name": "Contribute",
    "type": "content",
    "template": "partials/home/contribute.html",
    "path": "home/contribute",
    "order": 100
  },
  {
    "name": "Issues",
    "type": "content",
    "template": "partials/home/issues.html",
    "path": "home/issues",
    "order": 100
  },
  {
    "name": "Tools",
    "type": "content",
    "template": "partials/home/tools.html",
    "path": "home/tools",
    "order": 100
  }
]);