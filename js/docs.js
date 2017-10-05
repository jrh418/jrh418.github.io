angular
    // Injecting into our app module
    .module('bltDocs')

    // Creating an Angular constant and rendering a list of items as JSON
    .constant('DOCS', [
  {
    "name": "About",
    "type": "content",
    "template": "partials/about.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "about"
  },
  {
    "name": "API",
    "type": "content",
    "template": "partials/api.html",
    "controller": 0,
    "module": "api",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api"
  },
  {
    "name": "Documentation",
    "type": "content",
    "template": "partials/best-practices/documentation.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "best-practices/documentation"
  },
  {
    "name": "Going To Production",
    "type": "content",
    "template": "partials/best-practices/going-to-production.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "best-practices/going-to-production"
  },
  {
    "name": "Responsive Design",
    "type": "content",
    "template": "partials/best-practices/responsive-design.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "best-practices/responsive-design"
  },
  {
    "name": "Style Guide",
    "type": "content",
    "template": "partials/best-practices/style-guide.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "best-practices/style-guide"
  },
  {
    "name": "Testing",
    "type": "content",
    "template": "partials/best-practices/testing.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "best-practices/testing"
  },
  {
    "name": "Application Structure",
    "type": "content",
    "template": "partials/fundamentals/app-structure.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/app-structure"
  },
  {
    "name": "Application Templates",
    "type": "content",
    "template": "partials/fundamentals/app-templates.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/app-templates"
  },
  {
    "name": "Architecture",
    "type": "content",
    "template": "partials/fundamentals/architecture.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/architecture"
  },
  {
    "name": "Authentication",
    "type": "content",
    "template": "partials/fundamentals/authentication.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/authentication"
  },
  {
    "name": "Build & Deploy",
    "type": "content",
    "template": "partials/fundamentals/build-and-deploy.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/build-and-deploy"
  },
  {
    "name": "Command Line Interface",
    "type": "content",
    "template": "partials/fundamentals/cli.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/cli"
  },
  {
    "name": "Data API",
    "type": "content",
    "template": "partials/fundamentals/data-api.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/data-api"
  },
  {
    "name": "Form Controls",
    "type": "content",
    "template": "partials/fundamentals/form-controls.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/form-controls"
  },
  {
    "name": "Grid Layout",
    "type": "content",
    "template": "partials/fundamentals/grid-layout.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/grid-layout"
  },
  {
    "name": "Styles",
    "type": "content",
    "template": "partials/fundamentals/styles.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/styles"
  },
  {
    "name": "UI Components",
    "type": "content",
    "template": "partials/fundamentals/ui-components.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/ui-components"
  },
  {
    "name": "Views",
    "type": "content",
    "template": "partials/fundamentals/views.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "fundamentals/views"
  },
  {
    "name": "Quick Start",
    "type": "content",
    "template": "partials/getting-started.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "getting-started"
  },
  {
    "name": "Home",
    "type": "content",
    "template": "partials/home.html",
    "controller": 0,
    "module": "home",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": ""
  },
  {
    "name": "Contribute",
    "type": "content",
    "template": "partials/resources/contribute.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "resources/contribute"
  },
  {
    "name": "FAQ",
    "type": "content",
    "template": "partials/resources/faq.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "resources/faq"
  },
  {
    "name": "Goals",
    "type": "content",
    "template": "partials/resources/goals.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "resources/goals"
  },
  {
    "name": "Tools",
    "type": "content",
    "template": "partials/resources/tools.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "resources/tools"
  },
  {
    "name": "Troubleshooting",
    "type": "content",
    "template": "partials/resources/troubleshooting.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "resources/troubleshooting"
  },
  {
    "name": "Table of Contents",
    "type": "content",
    "template": "partials/table-of-contents.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "table-of-contents"
  },
  {
    "name": "Build & Deploy",
    "type": "content",
    "template": "partials/tutorial/build-and-deploy.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "tutorial/build-and-deploy"
  },
  {
    "name": "Configuration",
    "type": "content",
    "template": "partials/tutorial/configuration.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "tutorial/configuration"
  },
  {
    "name": "Data Access",
    "type": "content",
    "template": "partials/tutorial/data-access.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "tutorial/data-access"
  },
  {
    "name": "Introduction",
    "type": "content",
    "template": "partials/tutorial/introduction.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "tutorial/introduction"
  },
  {
    "name": "Responsive Design",
    "type": "content",
    "template": "partials/tutorial/responsive-design.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "tutorial/responsive-design"
  },
  {
    "name": "To Do Editor",
    "type": "content",
    "template": "partials/tutorial/todo-editor.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "tutorial/todo-editor"
  },
  {
    "name": "To Do Module",
    "type": "content",
    "template": "partials/tutorial/todo-module.html",
    "controller": 0,
    "module": "docs",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "tutorial/todo-module"
  },
  {
    "name": "blt_appbar",
    "type": "module",
    "template": "partials/api/blt_appbar.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_appbar"
  },
  {
    "name": "bltAppbar",
    "type": "directive",
    "template": "partials/api/blt_appbar/directive/bltAppbar.html",
    "controller": 0,
    "module": "blt_appbar",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_appbar/directive/bltAppbar"
  },
  {
    "name": "blt_auth",
    "type": "module",
    "template": "partials/api/blt_auth.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_auth"
  },
  {
    "name": "BltAuth",
    "type": "service",
    "template": "partials/api/blt_auth/service/BltAuth.html",
    "controller": 0,
    "module": "blt_auth",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_auth/service/BltAuth"
  },
  {
    "name": "BltAuthStorageService",
    "type": "service",
    "template": "partials/api/blt_auth/service/BltAuthStorageService.html",
    "controller": 0,
    "module": "blt_auth",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_auth/service/BltAuthStorageService"
  },
  {
    "name": "DevAuthService",
    "type": "service",
    "template": "partials/api/blt_auth/service/DevAuthService.html",
    "controller": 0,
    "module": "blt_auth",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_auth/service/DevAuthService"
  },
  {
    "name": "WampAuthService",
    "type": "service",
    "template": "partials/api/blt_auth/service/WampAuthService.html",
    "controller": 0,
    "module": "blt_auth",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_auth/service/WampAuthService"
  },
  {
    "name": "blt_card",
    "type": "module",
    "template": "partials/api/blt_card.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_card"
  },
  {
    "name": "bltCard",
    "type": "directive",
    "template": "partials/api/blt_card/directive/bltCard.html",
    "controller": 0,
    "module": "blt_card",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_card/directive/bltCard"
  },
  {
    "name": "blt_checkboxradio",
    "type": "module",
    "template": "partials/api/blt_checkboxradio.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_checkboxradio"
  },
  {
    "name": "bltCheckboxRadio",
    "type": "directive",
    "template": "partials/api/blt_checkboxradio/directive/bltCheckboxRadio.html",
    "controller": 0,
    "module": "blt_checkboxradio",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_checkboxradio/directive/bltCheckboxRadio"
  },
  {
    "name": "blt_classificationbar",
    "type": "module",
    "template": "partials/api/blt_classificationbar.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_classificationbar"
  },
  {
    "name": "bltClassificationBar",
    "type": "directive",
    "template": "partials/api/blt_classificationbar/directive/bltClassificationBar.html",
    "controller": 0,
    "module": "blt_classificationbar",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_classificationbar/directive/bltClassificationBar"
  },
  {
    "name": "blt_counter",
    "type": "module",
    "template": "partials/api/blt_counter.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_counter"
  },
  {
    "name": "bltCounter",
    "type": "directive",
    "template": "partials/api/blt_counter/directive/bltCounter.html",
    "controller": 0,
    "module": "blt_counter",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_counter/directive/bltCounter"
  },
  {
    "name": "blt_data",
    "type": "module",
    "template": "partials/api/blt_data.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_data"
  },
  {
    "name": "BltDataConfig",
    "type": "object",
    "template": "partials/api/blt_data/object/BltDataConfig.html",
    "controller": 0,
    "module": "blt_data",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_data/object/BltDataConfig"
  },
  {
    "name": "BltData",
    "type": "service",
    "template": "partials/api/blt_data/service/BltData.html",
    "controller": 0,
    "module": "blt_data",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_data/service/BltData"
  },
  {
    "name": "BltDatepickerUtils",
    "type": "service",
    "template": "partials/api/blt_datepicker/service/BltDatepickerUtils.html",
    "controller": 0,
    "module": "blt_datepicker",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_datepicker/service/BltDatepickerUtils"
  },
  {
    "name": "blt_datepicker",
    "type": "module",
    "template": "partials/api/blt_datepicker.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_datepicker"
  },
  {
    "name": "bltDatepicker",
    "type": "directive",
    "template": "partials/api/blt_datepicker/directive/bltDatepicker.html",
    "controller": 0,
    "module": "blt_datepicker",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_datepicker/directive/bltDatepicker"
  },
  {
    "name": "blt_dropdown",
    "type": "module",
    "template": "partials/api/blt_dropdown.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_dropdown"
  },
  {
    "name": "bltDropdown",
    "type": "directive",
    "template": "partials/api/blt_dropdown/directive/bltDropdown.html",
    "controller": 0,
    "module": "blt_dropdown",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_dropdown/directive/bltDropdown"
  },
  {
    "name": "blt_fileloader",
    "type": "module",
    "template": "partials/api/blt_fileloader.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_fileloader"
  },
  {
    "name": "bltFileloader",
    "type": "directive",
    "template": "partials/api/blt_fileloader/directive/bltFileloader.html",
    "controller": 0,
    "module": "blt_fileloader",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_fileloader/directive/bltFileloader"
  },
  {
    "name": "blt_list",
    "type": "module",
    "template": "partials/api/blt_list.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_list"
  },
  {
    "name": "bltList",
    "type": "directive",
    "template": "partials/api/blt_list/directive/bltList.html",
    "controller": 0,
    "module": "blt_list",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_list/directive/bltList"
  },
  {
    "name": "blt_login",
    "type": "module",
    "template": "partials/api/blt_login.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_login"
  },
  {
    "name": "bltLogin",
    "type": "directive",
    "template": "partials/api/blt_login/directive/bltLogin.html",
    "controller": 0,
    "module": "blt_login",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_login/directive/bltLogin"
  },
  {
    "name": "blt_menu",
    "type": "module",
    "template": "partials/api/blt_menu.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_menu"
  },
  {
    "name": "bltMenu",
    "type": "directive",
    "template": "partials/api/blt_menu/directive/bltMenu.html",
    "controller": 0,
    "module": "blt_menu",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_menu/directive/bltMenu"
  },
  {
    "name": "blt_modal",
    "type": "module",
    "template": "partials/api/blt_modal.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_modal"
  },
  {
    "name": "bltModal",
    "type": "directive",
    "template": "partials/api/blt_modal/directive/bltModal.html",
    "controller": 0,
    "module": "blt_modal",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_modal/directive/bltModal"
  },
  {
    "name": "blt_notifications",
    "type": "module",
    "template": "partials/api/blt_notifications.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_notifications"
  },
  {
    "name": "bltNotifications",
    "type": "directive",
    "template": "partials/api/blt_notifications/directive/bltNotifications.html",
    "controller": 0,
    "module": "blt_notifications",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_notifications/directive/bltNotifications"
  },
  {
    "name": "blt_panel",
    "type": "module",
    "template": "partials/api/blt_panel.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_panel"
  },
  {
    "name": "bltPanel",
    "type": "directive",
    "template": "partials/api/blt_panel/directive/bltPanel.html",
    "controller": 0,
    "module": "blt_panel",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_panel/directive/bltPanel"
  },
  {
    "name": "blt_table",
    "type": "module",
    "template": "partials/api/blt_table.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_table"
  },
  {
    "name": "bltTable",
    "type": "directive",
    "template": "partials/api/blt_table/directive/bltTable.html",
    "controller": 0,
    "module": "blt_table",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_table/directive/bltTable"
  },
  {
    "name": "blt_tab",
    "type": "module",
    "template": "partials/api/blt_tab.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_tab"
  },
  {
    "name": "bltTab",
    "type": "directive",
    "template": "partials/api/blt_tab/directive/bltTab.html",
    "controller": 0,
    "module": "blt_tab",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_tab/directive/bltTab"
  },
  {
    "name": "blt_textfield",
    "type": "module",
    "template": "partials/api/blt_textfield.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_textfield"
  },
  {
    "name": "bltTextField",
    "type": "directive",
    "template": "partials/api/blt_textfield/directive/bltTextField.html",
    "controller": 0,
    "module": "blt_textfield",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_textfield/directive/bltTextField"
  },
  {
    "name": "blt_toggleswitch",
    "type": "module",
    "template": "partials/api/blt_toggleswitch.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_toggleswitch"
  },
  {
    "name": "bltToggleSwitch",
    "type": "directive",
    "template": "partials/api/blt_toggleswitch/directive/bltToggleSwitch.html",
    "controller": 0,
    "module": "blt_toggleswitch",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_toggleswitch/directive/bltToggleSwitch"
  },
  {
    "name": "bltView",
    "type": "directive",
    "template": "partials/api/blt_view/directive/bltView.html",
    "controller": 0,
    "module": "blt_view",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_view/directive/bltView"
  },
  {
    "name": "ViewFactory",
    "type": "service",
    "template": "partials/api/blt_view/service/ViewFactory.html",
    "controller": 0,
    "module": "blt_view",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_view/service/ViewFactory"
  },
  {
    "name": "blt_view",
    "type": "module",
    "template": "partials/api/blt_view.html",
    "controller": 0,
    "module": "components",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_view"
  },
  {
    "name": "BltApi",
    "type": "service",
    "template": "partials/api/blt_core/service/BltApi.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/service/BltApi"
  },
  {
    "name": "blt_appProfile",
    "type": "module",
    "template": "partials/api/blt_appProfile.html",
    "controller": 0,
    "module": "blt_appProfile",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_appProfile"
  },
  {
    "name": "blt_appViews",
    "type": "module",
    "template": "partials/api/blt_appViews.html",
    "controller": 0,
    "module": "blt_appViews",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_appViews"
  },
  {
    "name": "blt_config",
    "type": "module",
    "template": "partials/api/blt_config.html",
    "controller": 0,
    "module": "blt_config",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_config"
  },
  {
    "name": "bltClose",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltClose.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltClose"
  },
  {
    "name": "bltOpen",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltOpen.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltOpen"
  },
  {
    "name": "bltOpenView",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltOpenView.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": true,
    "path": "api/blt_core/directive/bltOpenView"
  },
  {
    "name": "bltValidate",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltValidate.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltValidate"
  },
  {
    "name": "bltMain",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltMain.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltMain"
  },
  {
    "name": "blt_core",
    "type": "module",
    "template": "partials/api/blt_core.html",
    "controller": 0,
    "module": "core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core"
  },
  {
    "name": "blt_dataRoutes",
    "type": "module",
    "template": "partials/api/blt_dataRoutes.html",
    "controller": 0,
    "module": "blt_dataRoutes",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_dataRoutes"
  },
  {
    "name": "bltIfBp",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltIfBp.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltIfBp"
  },
  {
    "name": "bltSpinner",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltSpinner.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltSpinner"
  },
  {
    "name": "bltButton",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltButton.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltButton"
  },
  {
    "name": "bltCssUtilities",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltCssUtilities.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltCssUtilities"
  },
  {
    "name": "bltFont",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltFont.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltFont"
  },
  {
    "name": "bltForm",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltForm.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltForm"
  },
  {
    "name": "bltGrid",
    "type": "directive",
    "template": "partials/api/blt_core/directive/bltGrid.html",
    "controller": 0,
    "module": "blt_core",
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive/bltGrid"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "runnableExample",
    "template": "inline",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "inline"
  },
  {
    "type": "indexPage",
    "template": "index.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "index.html"
  },
  {
    "name": "directive components in blt_appbar",
    "type": "componentGroup",
    "template": "partials/api/blt_appbar/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_appbar/directive"
  },
  {
    "name": "service components in blt_auth",
    "type": "componentGroup",
    "template": "partials/api/blt_auth/service.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_auth/service"
  },
  {
    "name": "directive components in blt_card",
    "type": "componentGroup",
    "template": "partials/api/blt_card/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_card/directive"
  },
  {
    "name": "directive components in blt_checkboxradio",
    "type": "componentGroup",
    "template": "partials/api/blt_checkboxradio/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_checkboxradio/directive"
  },
  {
    "name": "directive components in blt_classificationbar",
    "type": "componentGroup",
    "template": "partials/api/blt_classificationbar/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_classificationbar/directive"
  },
  {
    "name": "directive components in blt_counter",
    "type": "componentGroup",
    "template": "partials/api/blt_counter/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_counter/directive"
  },
  {
    "name": "object components in blt_data",
    "type": "componentGroup",
    "template": "partials/api/blt_data/object.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_data/object"
  },
  {
    "name": "service components in blt_data",
    "type": "componentGroup",
    "template": "partials/api/blt_data/service.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_data/service"
  },
  {
    "name": "service components in blt_datepicker",
    "type": "componentGroup",
    "template": "partials/api/blt_datepicker/service.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_datepicker/service"
  },
  {
    "name": "directive components in blt_datepicker",
    "type": "componentGroup",
    "template": "partials/api/blt_datepicker/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_datepicker/directive"
  },
  {
    "name": "directive components in blt_dropdown",
    "type": "componentGroup",
    "template": "partials/api/blt_dropdown/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_dropdown/directive"
  },
  {
    "name": "directive components in blt_fileloader",
    "type": "componentGroup",
    "template": "partials/api/blt_fileloader/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_fileloader/directive"
  },
  {
    "name": "directive components in blt_list",
    "type": "componentGroup",
    "template": "partials/api/blt_list/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_list/directive"
  },
  {
    "name": "directive components in blt_login",
    "type": "componentGroup",
    "template": "partials/api/blt_login/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_login/directive"
  },
  {
    "name": "directive components in blt_menu",
    "type": "componentGroup",
    "template": "partials/api/blt_menu/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_menu/directive"
  },
  {
    "name": "directive components in blt_modal",
    "type": "componentGroup",
    "template": "partials/api/blt_modal/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_modal/directive"
  },
  {
    "name": "directive components in blt_notifications",
    "type": "componentGroup",
    "template": "partials/api/blt_notifications/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_notifications/directive"
  },
  {
    "name": "directive components in blt_panel",
    "type": "componentGroup",
    "template": "partials/api/blt_panel/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_panel/directive"
  },
  {
    "name": "directive components in blt_table",
    "type": "componentGroup",
    "template": "partials/api/blt_table/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_table/directive"
  },
  {
    "name": "directive components in blt_tab",
    "type": "componentGroup",
    "template": "partials/api/blt_tab/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_tab/directive"
  },
  {
    "name": "directive components in blt_textfield",
    "type": "componentGroup",
    "template": "partials/api/blt_textfield/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_textfield/directive"
  },
  {
    "name": "directive components in blt_toggleswitch",
    "type": "componentGroup",
    "template": "partials/api/blt_toggleswitch/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_toggleswitch/directive"
  },
  {
    "name": "directive components in blt_view",
    "type": "componentGroup",
    "template": "partials/api/blt_view/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_view/directive"
  },
  {
    "name": "service components in blt_view",
    "type": "componentGroup",
    "template": "partials/api/blt_view/service.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_view/service"
  },
  {
    "name": "service components in blt_core",
    "type": "componentGroup",
    "template": "partials/api/blt_core/service.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/service"
  },
  {
    "name": "directive components in blt_core",
    "type": "componentGroup",
    "template": "partials/api/blt_core/directive.html",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false,
    "path": "api/blt_core/directive"
  },
  {
    "name": "ExampleJavascript",
    "template": "data/example-javascript.js",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false
  },
  {
    "name": "ExampleCss",
    "template": "data/example-css.css",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false
  },
  {
    "name": "API_DATA",
    "template": "data/api-data.js",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false
  },
  {
    "name": "APP_API_DATA",
    "template": "data/app-api-data.js",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false
  },
  {
    "name": "ROUTES",
    "template": "js/routes.js",
    "controller": 0,
    "controllerAs": "$ctrl",
    "deprecated": false
  }
]);