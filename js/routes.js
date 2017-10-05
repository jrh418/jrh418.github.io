angular
    // Injecting into our app module
    .module('bltDocs')

    // Creating an Angular constant and rendering a list of items as JSON
    .constant('ROUTES', [
  {
    "name": "About",
    "type": "content",
    "template": "partials/about.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "about"
  },
  {
    "name": "Documentation",
    "type": "content",
    "template": "partials/best-practices/documentation.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "best-practices/documentation"
  },
  {
    "name": "Going To Production",
    "type": "content",
    "template": "partials/best-practices/going-to-production.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "best-practices/going-to-production"
  },
  {
    "name": "Responsive Design",
    "type": "content",
    "template": "partials/best-practices/responsive-design.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "best-practices/responsive-design"
  },
  {
    "name": "Style Guide",
    "type": "content",
    "template": "partials/best-practices/style-guide.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "best-practices/style-guide"
  },
  {
    "name": "Testing",
    "type": "content",
    "template": "partials/best-practices/testing.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "best-practices/testing"
  },
  {
    "name": "Application Structure",
    "type": "content",
    "template": "partials/fundamentals/app-structure.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/app-structure"
  },
  {
    "name": "Application Templates",
    "type": "content",
    "template": "partials/fundamentals/app-templates.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/app-templates"
  },
  {
    "name": "Architecture",
    "type": "content",
    "template": "partials/fundamentals/architecture.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/architecture"
  },
  {
    "name": "Authentication",
    "type": "content",
    "template": "partials/fundamentals/authentication.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/authentication"
  },
  {
    "name": "Build & Deploy",
    "type": "content",
    "template": "partials/fundamentals/build-and-deploy.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/build-and-deploy"
  },
  {
    "name": "Command Line Interface",
    "type": "content",
    "template": "partials/fundamentals/cli.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/cli"
  },
  {
    "name": "Data API",
    "type": "content",
    "template": "partials/fundamentals/data-api.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/data-api"
  },
  {
    "name": "Form Controls",
    "type": "content",
    "template": "partials/fundamentals/form-controls.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/form-controls"
  },
  {
    "name": "Grid Layout",
    "type": "content",
    "template": "partials/fundamentals/grid-layout.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/grid-layout"
  },
  {
    "name": "Styles",
    "type": "content",
    "template": "partials/fundamentals/styles.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/styles"
  },
  {
    "name": "UI Components",
    "type": "content",
    "template": "partials/fundamentals/ui-components.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/ui-components"
  },
  {
    "name": "Views",
    "type": "content",
    "template": "partials/fundamentals/views.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "fundamentals/views"
  },
  {
    "name": "Quick Start",
    "type": "content",
    "template": "partials/getting-started.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "getting-started"
  },
  {
    "name": "Home",
    "type": "content",
    "template": "partials/home.html",
    "controller": "HomeController",
    "controllerAs": "$ctrl",
    "path": ""
  },
  {
    "name": "Contribute",
    "type": "content",
    "template": "partials/resources/contribute.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "resources/contribute"
  },
  {
    "name": "FAQ",
    "type": "content",
    "template": "partials/resources/faq.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "resources/faq"
  },
  {
    "name": "Goals",
    "type": "content",
    "template": "partials/resources/goals.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "resources/goals"
  },
  {
    "name": "Tools",
    "type": "content",
    "template": "partials/resources/tools.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "resources/tools"
  },
  {
    "name": "Troubleshooting",
    "type": "content",
    "template": "partials/resources/troubleshooting.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "resources/troubleshooting"
  },
  {
    "name": "Table of Contents",
    "type": "content",
    "template": "partials/table-of-contents.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "table-of-contents"
  },
  {
    "name": "Build & Deploy",
    "type": "content",
    "template": "partials/tutorial/build-and-deploy.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "tutorial/build-and-deploy"
  },
  {
    "name": "Configuration",
    "type": "content",
    "template": "partials/tutorial/configuration.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "tutorial/configuration"
  },
  {
    "name": "Data Access",
    "type": "content",
    "template": "partials/tutorial/data-access.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "tutorial/data-access"
  },
  {
    "name": "Introduction",
    "type": "content",
    "template": "partials/tutorial/introduction.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "tutorial/introduction"
  },
  {
    "name": "Responsive Design",
    "type": "content",
    "template": "partials/tutorial/responsive-design.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "tutorial/responsive-design"
  },
  {
    "name": "To Do Editor",
    "type": "content",
    "template": "partials/tutorial/todo-editor.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "tutorial/todo-editor"
  },
  {
    "name": "To Do Module",
    "type": "content",
    "template": "partials/tutorial/todo-module.html",
    "controller": "DocsController",
    "controllerAs": "$ctrl",
    "path": "tutorial/todo-module"
  }
]);