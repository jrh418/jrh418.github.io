(function(){
  'use strict'

  

  

  

  

  
    angular.module("bltDocs")
      .controller("CheckboxRadioExampleCtrl", function(){
        var ctrl = this;
        ctrl.doWhenValueChanges = function(){alert(ctrl.checkbox2)};
        ctrl.checkboxOptions = ["Option 1", "Option 2", "Option 3"];
      });
  

  

  

  

  

  

  

  

  
    angular.module("bltDocs")
      .controller("CounterExampleCtrl", function(){
        var ctrl = this;
        ctrl.counter1 = 4;
        ctrl.counter2;
        ctrl.counter3;
      });
  

  

  
    angular.module("bltDocs")
      .controller("DatePickerExCtrl", function(){
        var ctrl = this;
        ctrl.mindate = new Date();
        ctrl.firstview = "hours"
        ctrl.lastview = "month"
      });
  

  

  
    angular.module("bltDocs")
      .controller("DropdownExampleCtrl", function(){
        var ctrl = this;
        ctrl.arrayOfOptions = ["Value 1", "Value 2", "Value 3"];
      });
  

  

  
    angular.module("bltDocs")
      .controller("DropdownExampleCtrl2", function(){
        var ctrl = this;
        ctrl.arrayOfOptions = ["Value 1", "Value 2", "Value 3"];
      });
  

  

  
    angular.module("bltDocs")
      .controller("DropdownExampleCtrl3", function(){
        var ctrl = this;
        ctrl.optionMap = {
          value1: "Value One",
          value2: "Value Two",
          value3: "Value Three"
        }
      });
  

  

  
    angular.module('bltDocs')
      .controller("FileExCtrl", function(){
        var ctrl = this;
        ctrl.file = undefined;
      });
  

  

  
    angular.module("bltDocs")
      .controller("ListExCtrl", function(){
        var ctrl = this;
        ctrl.listItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
      });
  

  

  
    angular.module("bltDocs")
      .controller("ListExCtrl2a", function(){
        var ctrl = this; 
        ctrl.listItems = ["Item 1", "Item 2", "Item 3"]; 
      });
   

  

  
    angular.module("bltDocs")
      .controller("ListExCtrl2b", function(){
        var ctrl = this; 
        ctrl.listItems = ["Item 1", "Item 2", "Item 3"];
      });
   

  

  
        angular.module("bltDocs")
          .controller("ListExCtrl2c", function(){
            var ctrl = this; 
            ctrl.listItems = [{id: "Item 1", done: false}, {id: "Item 2", done: false}, {id: "Item 3", done: false}];
          });
     

  

  
    angular.module("bltDocs")
      .controller("ListExCtrl3", function(){
        var ctrl = this; 
        ctrl.listItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
      });
   

  

  
    angular.module("bltDocs")
      .controller("ListExCtrl4", function(){
        var ctrl = this; 
        ctrl.listItems = [{id: "Item 1", pending: false}, {id: "Item 2", pending: true}, 
          {id: "Item 3", pending: true}];
      });
   

  

  
    angular.module("bltDocs")
      .controller("ListExCtrl5", function(){
        var ctrl = this; 
        ctrl.listItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
        ctrl.subItems = ["Sub Item 1", "Sub Item 2", "Sub Item 3"];
      });


  

  
    angular.module("bltDocs")
      .controller("ListExCtrl6", function(){
        var ctrl = this; 
        ctrl.listItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
      });
   

  

  
   angular.module("bltDocs")
     .controller("ListExCtrl7", function(){
       var ctrl = this; 
       ctrl.listItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
     });


  

  
    angular.module("bltDocs")
      .controller("MenuExCtrl", function(){
        var ctrl = this;
        ctrl.disableItem4 = true;
      });
  

  

  
    angular.module("bltDocs")
         .controller('ModalExController', ModalExController)
     ;
     ModalExController.$inject=["BltApi"];
     function ModalExController(bltApi) {
         var ctrl = this;            
         
         ctrl.flip = function(modalId) {
             bltApi.publish(modalId, 'flip');
         }
     }
  

  

  
    angular.module("bltDocs")
      .controller("NotifyExCtrl", NotifyExCtrl)
    ;
    NotifyExCtrl.$inject = ["BltApi"];
    function NotifyExCtrl(bltApi){
      var ctrl = this;
      //Create a controller function to publish a simple notification.
      ctrl.simpleNotify = function(){
        var notification = {
          text: 'Successfully completed request.'
        }
        bltApi.publish('notify', notification);
      }
      //Create controller function to publish a notification with a callback.
      ctrl.notifyWithCallback = function(){
        var notification = {
          text: 'Failed to complete request.',
          callback: {
            name: 'notifyCallbackEx',
            action: {
              error: "Error Message"
            },
            text: 'handle error'
          }
        }
        bltApi.publish('notify', notification);
      }
      //Subscribe to the 'notifyCallbackEx' channel to handle notification callbacks from the above notification.
      bltApi.subscribe('notifyCallbackEx', function(notificationAction){
        alert(notificationAction.error);
      });
    }
  

  

  

  

  
    angular.module("bltDocs")
      .controller("TableExCtrl", TableExCtrl)
    ;

    TableExCtrl.$inject = ['$timeout'];
    function TableExCtrl($timeout){
         var ctrl = this;


         ctrl.categories = ["one", "two", "three", "four"]
         ctrl.deleteItem =  deleteItem;
         ctrl.approveItem = approveItem;

         activate();


         function activate(){
           ctrl.tableItems = items();
         }

         function approveItem(itemId){
           var item = itemLookup(itemId);
           if(item){
             item.approved = true;
           }
         }

         function deleteItem(itemId){
           var idx = itemIdxLookup(itemId);
           if(idx >= 0){
             ctrl.tableItems.splice(idx, 1);
           }
         }

         function itemLookup(itemId){
           var idx = itemIdxLookup(itemId);
           if(idx > -1){
             return ctrl.tableItems[idx];
           }
         }

         function itemIdxLookup(itemId){
           for(var idx in ctrl.tableItems){
             if(ctrl.tableItems[idx].id == itemId){
               return idx;
             }
           }
           return -1;
         }

         //Normally we would use the data api to retrieve items from a data endpoint. For this example we will
         //just use a hard coded list of items.
         function items(){
           return [
             {
               id: "item1",
               comments: "comment for item 1.",
               category: "one",
               description: "description of item 1.",
               tags: ["cell", "item", "tag"]
             },
             {
               id: "item2",
               comments: "comment for item 2.",
               category: "two",
               description: "description of item 2.",
               tags: ["cell", "item", "tag"]
             },
             {
               id: "item3",
               comments: "comment for item 3.",
               category: "two",
               description: "description of item 3.",
               tags: ["item", "tag"]
             },
             {
               id: "item4",
               comments: "comment for item 4.",
               category: "one",
               description: "description of item 4.",
               tags: ["cell", "tag"]
             }
           ]
         }
      }
  

  

  
     angular.module("bltDocs")
         .controller('TabExController', TabExController)
     ;
     function TabExController() {
         var ctrl = this;
         ctrl.activeTab = 1
         ctrl.selectTab = function() {
             (ctrl.activeTab == 2) ? ctrl.activeTab = 1 : ctrl.activeTab = 2;
         }
     }
  

  

  
     angular.module("bltDocs")
         .controller('TabIconExController', TabIconExController)
     ;
     function TabIconExController() {
         var ctrl = this;
         ctrl.activeIconTab = 1;
     }
     angular.module("bltDocs")
         .controller("MenuExCtrl", function(){
             var ctrl = this;
     });
 

  

  
    angular.module("bltDocs")
      .controller("MyCtrl", function(){
        var ctrl = this;
      });
  

  

  
    angular.module("bltDocs")
      .controller("MyCtrl2", function(){
        var ctrl = this;
      });
  

  

  
    angular.module("bltDocs")
      .controller("MyCtrl3", function(){
        var ctrl = this;
      });
  

  

  
    angular.module("bltDocs")
      .controller("MyCtrl4", function(){
        var ctrl = this;
      });
  

  

  
    angular.module("bltDocs")
      .controller("MyCtrl5", function(){
        var ctrl = this;
      });
  

  

  
    angular.module("bltDocs")
      .controller("MyCtrl6", MyCtrl6); 

     MyCtrl6.$inject = ['BltApi']; 

     function MyCtrl6(api){
       var ctrl = this;
       var phoneLabel;
       ctrl.phoneLabel = "Telephone Field";
     }
  

  

  
    angular.module("bltDocs")
      .controller("MyCtrl7", function(){
        var ctrl = this;
      });
  

  

  
    angular.module("bltDocs").controller("ToggleExCtrl1", function(){});
  

  

  
    angular.module("bltDocs").controller("ToggleExCtrl2", function(){});
  

  

  
    angular.module("bltDocs").controller("ToggleExCtrl3", function(){});
  

  

  
    angular.module("bltDocs").controller("ToggleExCtrl4", function(){});
  

  

  
    angular.module("bltDocs")
      .controller("BltValidateCtrl", function(){
        var ctrl = this;
        ctrl.customValidator = {
          name: 'test', // The name of your custom validator object
          type: 'sync', // The type of validator: async or sync. See the Angular docs for more information.
          msg: "We're looking for 'Test'.", // The error message if invalid
          validationFn: function(modelValue, viewValue){ // The function to run to determine validity
            if( viewValue === 'Test' ){
              return true;
            } else {
              return false;
            }
          }
        };
      });
  

  

  
  angular.module('bltDocs')
    .controller('BPCtrl', function(){
      var ctrl = this;
      ctrl.bp = {
        bp: 'md',
        dir: 'down'
       }
    });


  

  

  

  

  

  
     angular.module('bltDocs')
       .controller('FormExCtrl', FormExCtrl);

       FormExCtrl.$inject = ['BltApi'];

       function FormExCtrl(bltApi){
          var ctrl = this;
       
          ctrl.arrayOfOptions = ['Dropdown1', 'Dropdown2', 'Dropdown3', 'Dropdown4', 'Dropdown5', 
            'Dropdown6', 'Dropdown7'];
        
          ctrl.cancel = cancel;
          ctrl.submit = submit;
        
          activate();
       
          // Public Functions
          function cancel(){
              //Close the form modal / view or clear out values to signify a form reset / cancel.
          }
       
          function submit(){
              // First we check the form to ensure that it is valid.
              if( !ctrl.myForm.$invalid ){
                  // Form is valid. Do something with the data. As part of a successful submit, 
                  //we'll also typically switch to a new view, or close the modal that was containing the form.
                  console.log('form valid. submitting.');
              } else {
                  // Form is invalid. All relevant error messages will now be showing in the form.
                  console.log('form invalid');
              }
          }
        
          // Private Functions
          // Activate the controller. Initialize form values. In this example demonstrate setting them as 
          // undefined, hard coded values, or values pulled from a service.
          function activate(){
              //Hard coded initial value
              ctrl.textField = "ABC123";
              ctrl.checkboxFlag = true;
              //Undefined
              ctrl.option = undefined;
              ctrl.select = ctrl.arrayOfOptions[0];
          }
       }
  

  
})();