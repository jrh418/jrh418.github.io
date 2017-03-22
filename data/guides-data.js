angular
    // Injecting into our app module
    .module('bltDocs')

    // Creating an Angular constant and rendering a list of items as JSON
    .constant('GUIDES_DATA', [
  {
    "name": "Introduction",
    "type": "content",
    "template": "partials/guides.html",
    "path": "guides",
    "order": 1
  },
  {
    "name": "Authentication",
    "type": "content",
    "template": "partials/guides/authentication.html",
    "path": "guides/authentication",
    "order": 4
  },
  {
    "name": "Media Query Support",
    "type": "content",
    "template": "partials/guides/breakpoints.html",
    "path": "guides/breakpoints",
    "order": 100
  },
  {
    "name": "Configuring your App",
    "type": "content",
    "template": "partials/guides/configuration.html",
    "path": "guides/configuration",
    "order": 3
  },
  {
    "name": "Data API Configuration",
    "type": "content",
    "template": "partials/guides/data-api.html",
    "path": "guides/data-api",
    "order": 4
  },
  {
    "name": "Writing ngBoltJS Documentation",
    "type": "content",
    "template": "partials/guides/documentation.html",
    "path": "guides/documentation",
    "order": 100
  },
  {
    "name": "Getting Started",
    "type": "content",
    "template": "partials/guides/getting-started.html",
    "path": "guides/getting-started",
    "order": 2
  },
  {
    "name": "Editing Themes",
    "type": "content",
    "template": "partials/guides/theme.html",
    "path": "guides/theme",
    "order": 5
  }
]);