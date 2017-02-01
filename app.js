(function () {
'use strict';
//nbarman
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownControllerFn )
.service('MenuSearchService',MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");


//Defining the directive
function FoundItemsDirective(){

  var ddo = {
      
      templateUrl : 'menuItemsList.html',
      scope:{
          found : '<'
      },
        controller : NarrowItDownControllerFn,
        controllerAs: 'itemsCtrl',
        bindToController: true
  };

  return ddo;
}


//Declaration of the controller
NarrowItDownControllerFn.$inject = ['MenuSearchService'];
function NarrowItDownControllerFn(MenuSearchService){

  var itemsCtrl = this;

  itemsCtrl.getMenuItemsFromService = function(){

        var promise = MenuSearchService.getMatchedMenuItems(itemsCtrl.searchMenuItem);

        promise.then(function(items){
            //console.log(items);
            itemsCtrl.found = items;
            console.log(itemsCtrl.found);
        });
        };
}


// The service to call the resturant app
MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service  =   this;

  service.getMatchedMenuItems = function(searchTerm){
         return $http({
            method : "GET",
            url: (ApiBasePath + "/menu_items.json")

              }).then(function(result){
                    var allMenuItems = result.data.menu_items;
                    var i, matchedItems = [];
                    for(i=0;i<allMenuItems.length;i++){
                      var itemDescription = allMenuItems[i].description;
                    //  console.log(itemDescription);

                      if(itemDescription.toLowerCase().indexOf(searchTerm) !== -1){
                        var item ={
                          name : allMenuItems[i].name,
                          description : allMenuItems[i].description,
                          s_name : allMenuItems[i].short_name
                        }
                        matchedItems.push(item);
                      }
                    }
                    return matchedItems;
              });

  }
}


})();