angular
    // Injecting into our app module
    .module('bltDocs')

    // Creating an Angular constant and rendering a list of items as JSON
    .constant('API_DATA', [
  {
    "name": "blt_appbar",
    "type": "module",
    "template": "partials/api/blt_appbar.html",
    "path": "/#/api/blt_appbar",
    "order": 100,
    "docs": [
      {
        "name": "bltAppbar",
        "type": "directive",
        "template": "partials/api/blt_appbar/directive/bltAppbar.html",
        "path": "/#/api/blt_appbar/directive/bltAppbar",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_auth",
    "type": "module",
    "template": "partials/api/blt_auth.html",
    "path": "/#/api/blt_auth",
    "order": 100,
    "docs": [
      {
        "name": "BltAuth",
        "type": "service",
        "template": "partials/api/blt_auth/service/BltAuth.html",
        "path": "/#/api/blt_auth/service/BltAuth",
        "order": 100
      },
      {
        "name": "BltAuthStorageService",
        "type": "service",
        "template": "partials/api/blt_auth/service/BltAuthStorageService.html",
        "path": "/#/api/blt_auth/service/BltAuthStorageService",
        "order": 100
      },
      {
        "name": "DevAuthService",
        "type": "service",
        "template": "partials/api/blt_auth/service/DevAuthService.html",
        "path": "/#/api/blt_auth/service/DevAuthService",
        "order": 100
      },
      {
        "name": "WampAuthService",
        "type": "service",
        "template": "partials/api/blt_auth/service/WampAuthService.html",
        "path": "/#/api/blt_auth/service/WampAuthService",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_card",
    "type": "module",
    "template": "partials/api/blt_card.html",
    "path": "/#/api/blt_card",
    "order": 100,
    "docs": [
      {
        "name": "bltCard",
        "type": "directive",
        "template": "partials/api/blt_card/directive/bltCard.html",
        "path": "/#/api/blt_card/directive/bltCard",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_checkboxradio",
    "type": "module",
    "template": "partials/api/blt_checkboxradio.html",
    "path": "/#/api/blt_checkboxradio",
    "order": 100,
    "docs": [
      {
        "name": "bltCheckboxRadio",
        "type": "directive",
        "template": "partials/api/blt_checkboxradio/directive/bltCheckboxRadio.html",
        "path": "/#/api/blt_checkboxradio/directive/bltCheckboxRadio",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_classificationbar",
    "type": "module",
    "template": "partials/api/blt_classificationbar.html",
    "path": "/#/api/blt_classificationbar",
    "order": 100,
    "docs": [
      {
        "name": "bltClassificationBar",
        "type": "directive",
        "template": "partials/api/blt_classificationbar/directive/bltClassificationBar.html",
        "path": "/#/api/blt_classificationbar/directive/bltClassificationBar",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_counter",
    "type": "module",
    "template": "partials/api/blt_counter.html",
    "path": "/#/api/blt_counter",
    "order": 100,
    "docs": [
      {
        "name": "bltCounter",
        "type": "directive",
        "template": "partials/api/blt_counter/directive/bltCounter.html",
        "path": "/#/api/blt_counter/directive/bltCounter",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_data",
    "type": "module",
    "template": "partials/api/blt_data.html",
    "path": "/#/api/blt_data",
    "order": 100,
    "docs": [
      {
        "name": "BltDataConfig",
        "type": "object",
        "template": "partials/api/blt_data/object/BltDataConfig.html",
        "path": "/#/api/blt_data/object/BltDataConfig",
        "order": 100
      },
      {
        "name": "BltData",
        "type": "service",
        "template": "partials/api/blt_data/service/BltData.html",
        "path": "/#/api/blt_data/service/BltData",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_datepicker",
    "type": "module",
    "template": "partials/api/blt_datepicker.html",
    "path": "/#/api/blt_datepicker",
    "order": 100,
    "docs": [
      {
        "name": "BltDatepickerUtils",
        "type": "service",
        "template": "partials/api/blt_datepicker/service/BltDatepickerUtils.html",
        "path": "/#/api/blt_datepicker/service/BltDatepickerUtils",
        "order": 100
      },
      {
        "name": "bltDatepicker",
        "type": "directive",
        "template": "partials/api/blt_datepicker/directive/bltDatepicker.html",
        "path": "/#/api/blt_datepicker/directive/bltDatepicker",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_dropdown",
    "type": "module",
    "template": "partials/api/blt_dropdown.html",
    "path": "/#/api/blt_dropdown",
    "order": 100,
    "docs": [
      {
        "name": "bltDropdown",
        "type": "directive",
        "template": "partials/api/blt_dropdown/directive/bltDropdown.html",
        "path": "/#/api/blt_dropdown/directive/bltDropdown",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_fileloader",
    "type": "module",
    "template": "partials/api/blt_fileloader.html",
    "path": "/#/api/blt_fileloader",
    "order": 100,
    "docs": [
      {
        "name": "bltFileloader",
        "type": "directive",
        "template": "partials/api/blt_fileloader/directive/bltFileloader.html",
        "path": "/#/api/blt_fileloader/directive/bltFileloader",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_list",
    "type": "module",
    "template": "partials/api/blt_list.html",
    "path": "/#/api/blt_list",
    "order": 100,
    "docs": [
      {
        "name": "bltList",
        "type": "directive",
        "template": "partials/api/blt_list/directive/bltList.html",
        "path": "/#/api/blt_list/directive/bltList",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_login",
    "type": "module",
    "template": "partials/api/blt_login.html",
    "path": "/#/api/blt_login",
    "order": 100,
    "docs": [
      {
        "name": "bltLogin",
        "type": "directive",
        "template": "partials/api/blt_login/directive/bltLogin.html",
        "path": "/#/api/blt_login/directive/bltLogin",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_menu",
    "type": "module",
    "template": "partials/api/blt_menu.html",
    "path": "/#/api/blt_menu",
    "order": 100,
    "docs": [
      {
        "name": "bltMenu",
        "type": "directive",
        "template": "partials/api/blt_menu/directive/bltMenu.html",
        "path": "/#/api/blt_menu/directive/bltMenu",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_modal",
    "type": "module",
    "template": "partials/api/blt_modal.html",
    "path": "/#/api/blt_modal",
    "order": 100,
    "docs": [
      {
        "name": "bltModal",
        "type": "directive",
        "template": "partials/api/blt_modal/directive/bltModal.html",
        "path": "/#/api/blt_modal/directive/bltModal",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_notifications",
    "type": "module",
    "template": "partials/api/blt_notifications.html",
    "path": "/#/api/blt_notifications",
    "order": 100,
    "docs": [
      {
        "name": "bltNotifications",
        "type": "directive",
        "template": "partials/api/blt_notifications/directive/bltNotifications.html",
        "path": "/#/api/blt_notifications/directive/bltNotifications",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_panel",
    "type": "module",
    "template": "partials/api/blt_panel.html",
    "path": "/#/api/blt_panel",
    "order": 100,
    "docs": [
      {
        "name": "bltPanel",
        "type": "directive",
        "template": "partials/api/blt_panel/directive/bltPanel.html",
        "path": "/#/api/blt_panel/directive/bltPanel",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_table",
    "type": "module",
    "template": "partials/api/blt_table.html",
    "path": "/#/api/blt_table",
    "order": 100,
    "docs": [
      {
        "name": "bltTable",
        "type": "directive",
        "template": "partials/api/blt_table/directive/bltTable.html",
        "path": "/#/api/blt_table/directive/bltTable",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_tab",
    "type": "module",
    "template": "partials/api/blt_tab.html",
    "path": "/#/api/blt_tab",
    "order": 100,
    "docs": [
      {
        "name": "bltTab",
        "type": "directive",
        "template": "partials/api/blt_tab/directive/bltTab.html",
        "path": "/#/api/blt_tab/directive/bltTab",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_textfield",
    "type": "module",
    "template": "partials/api/blt_textfield.html",
    "path": "/#/api/blt_textfield",
    "order": 100,
    "docs": [
      {
        "name": "bltTextField",
        "type": "directive",
        "template": "partials/api/blt_textfield/directive/bltTextField.html",
        "path": "/#/api/blt_textfield/directive/bltTextField",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_toggleswitch",
    "type": "module",
    "template": "partials/api/blt_toggleswitch.html",
    "path": "/#/api/blt_toggleswitch",
    "order": 100,
    "docs": [
      {
        "name": "bltToggleSwitch",
        "type": "directive",
        "template": "partials/api/blt_toggleswitch/directive/bltToggleSwitch.html",
        "path": "/#/api/blt_toggleswitch/directive/bltToggleSwitch",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_view",
    "type": "module",
    "template": "partials/api/blt_view.html",
    "path": "/#/api/blt_view",
    "order": 100,
    "docs": [
      {
        "name": "bltView",
        "type": "directive",
        "template": "partials/api/blt_view/directive/bltView.html",
        "path": "/#/api/blt_view/directive/bltView",
        "order": 100
      },
      {
        "name": "ViewFactory",
        "type": "service",
        "template": "partials/api/blt_view/service/ViewFactory.html",
        "path": "/#/api/blt_view/service/ViewFactory",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_core",
    "type": "module",
    "template": "partials/api/blt_core.html",
    "path": "/#/api/blt_core",
    "order": 1,
    "docs": [
      {
        "name": "BltApi",
        "type": "service",
        "template": "partials/api/blt_core/service/BltApi.html",
        "path": "/#/api/blt_core/service/BltApi",
        "order": 100
      },
      {
        "name": "bltClose",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltClose.html",
        "path": "/#/api/blt_core/directive/bltClose",
        "order": 100
      },
      {
        "name": "bltOpen",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltOpen.html",
        "path": "/#/api/blt_core/directive/bltOpen",
        "order": 100
      },
      {
        "name": "bltOpenView",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltOpenView.html",
        "path": "/#/api/blt_core/directive/bltOpenView",
        "deprecated": "Use the `href` attribute or `ngHref` directive on an HTML `<a>` tag instead.",
        "order": 100
      },
      {
        "name": "bltValidate",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltValidate.html",
        "path": "/#/api/blt_core/directive/bltValidate",
        "order": 100
      },
      {
        "name": "bltMain",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltMain.html",
        "path": "/#/api/blt_core/directive/bltMain",
        "order": 100
      },
      {
        "name": "bltIfBp",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltIfBp.html",
        "path": "/#/api/blt_core/directive/bltIfBp",
        "order": 100
      },
      {
        "name": "bltSpinner",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltSpinner.html",
        "path": "/#/api/blt_core/directive/bltSpinner",
        "order": 100
      },
      {
        "name": "bltButton",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltButton.html",
        "path": "/#/api/blt_core/directive/bltButton",
        "order": 100
      },
      {
        "name": "bltCssUtilities",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltCssUtilities.html",
        "path": "/#/api/blt_core/directive/bltCssUtilities",
        "order": 100
      },
      {
        "name": "bltFont",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltFont.html",
        "path": "/#/api/blt_core/directive/bltFont",
        "order": 100
      },
      {
        "name": "bltForm",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltForm.html",
        "path": "/#/api/blt_core/directive/bltForm",
        "order": 100
      },
      {
        "name": "bltGrid",
        "type": "directive",
        "template": "partials/api/blt_core/directive/bltGrid.html",
        "path": "/#/api/blt_core/directive/bltGrid",
        "order": 100
      }
    ]
  },
  {
    "name": "blt_appProfile",
    "type": "module",
    "template": "partials/api/blt_appProfile.html",
    "path": "/#/api/blt_appProfile",
    "order": 2,
    "docs": []
  },
  {
    "name": "blt_appViews",
    "type": "module",
    "template": "partials/api/blt_appViews.html",
    "path": "/#/api/blt_appViews",
    "order": 3,
    "docs": []
  },
  {
    "name": "blt_config",
    "type": "module",
    "template": "partials/api/blt_config.html",
    "path": "/#/api/blt_config",
    "order": 2,
    "docs": []
  },
  {
    "name": "blt_dataRoutes",
    "type": "module",
    "template": "partials/api/blt_dataRoutes.html",
    "path": "/#/api/blt_dataRoutes",
    "order": 3,
    "docs": []
  }
]);