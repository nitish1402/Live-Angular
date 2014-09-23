'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngRoute'])
  .value('version', '0.1')
  .service('readEntity',function($http){

    this.get = function(path,id,enData)
    {

      console.log(path+"  "+id);

      $http.get('/services/'+path+'/'+id).
      success(function(data){
        enData = data.entityinfo;
        console.log(enData);
      //  return entityData;
      });


    }
  })
 .factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
