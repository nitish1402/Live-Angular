'use strict';


//previously with ui-grid
//changing structure to angular-kendo grid
//editable option unchecking

/* Controllers */
var socket = io('http://localhost:3000');
var courses = []; //initilising courses
function CourseIndexCtrl($scope, $http, $location) {




  $scope.mySelections = [];


  var http = $http;


    //courses is the array of all data
    //currently holding
    //[{cid:'',cname:''}]

  //introducing kendo-ui
  $scope.mainGridOptions = {
    dataSource : {

      type : 'json',
      transport: {


            read: {
              url:"services/courses",
              datatype : 'jsonp'
            },
            update : {
              url : function(e){
                console.log(e.models[0]);
                http.put('services/course/'+e.models[0].cid,e.models[0]).success(function(data){

                  console.log("success");

                })
              }

            },
            destroy : {
              url : function(e){
                console.log(e);
                 $http.delete('/services/course/' + e.models[0].cid+'/edit/'+e.models[0].cid).
                    success(function(data){
                   $location.path('/courses');
                 });
              }
            },
            parameterMap: function (options,operation) {
                    // this is optional - if we need to remove any parameters (due to partial OData support in WebAPI
                    /*if (operation !== "read" && options.models) {
                      console.log("here");
                      for(var elem in options.models)
                      {
                        console.log(elem + ":"+ options[elem]);
                      }
                       return {models: kendo.stringify(options.models)};
                    }
*/
                    if(operation === "update")
                    {
                      //update();
                    }
                },


             },
      requestStart: function(e) {
                if (e.type == "update") {

                    console.log(kendo.format("Request start ({0})", e.type));

                }
            },
      pageSize: 2,
      schema: {
          data : 'entityarr',
          model: {
               id : 'cid',
               fields: {
                    cid: { editable:false,type: "string" },
                    cname: { type: "string" },

                }
          },
          total: "entityarr.length"
      },

      batch : true

    },

    selectable : false,
    groupable: true,
    sortable: true,
    pageable:{
      pageSize : 2,
      refresh : true,
      pageSizes : false
    },
    editable: "inline",


    columns : [
      {
        title : 'Edit',
        template:'<a ng-href="courses/{{dataItem.cid}}/edit"><center>Edit</center></a>',
        width : '60px'
      },
      {
        field:'cid',
        title : 'Couse Id',
        width : '120px'
      },
      {
        field : 'cname',
        title : 'Course name',
        width : '180px'
      },
      { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
    ]

    }

    $scope.onSelection = function(kendoEvent) {
        var grid = kendoEvent.sender;
        var selectedData = grid.dataItem(grid.select());
        console.log(selectedData);
    }


}



function ReadCourseCtrl($scope, $http, $routeParams) {
  console.log($routeParams.id+"  ididi");


  $http.get('/services/course/' + $routeParams.id).
  success(function(data){
    $scope.course = data.entityinfo;
  });

}

function AddCourseCtrl($scope, $http, $location) {
  //console.log($location.path('/'));
  $scope.form = {};
  $scope.submitCourse = function(){
    $http.post('/services/newCourse', $scope.form).
    success(function(data){
      $location.path('/courses');
    });
  };
}


function EditCourseCtrl($scope, $http, $location, $routeParams) {


  console.log($routeParams.id);



  $http.get('/services/course/' + $routeParams.id).
  success(function(data){
    $scope.form = data.entityinfo;
  });

  $scope.editCourse = function(){


    $http.put('/services/course/' + $routeParams.id, $scope.form).
    success(function(data){
      $location.path('/courses/' + $routeParams.id);
      var datain = data;
      socket.emit('edit:course',function(){
          console.log("logging:"+datain);
      });
    });
  };



  $scope.cancel = function(){
    $location.path('/courses');
  }

}


function DeleteCourseCtrl($scope, $http, $location, $routeParams) {


  console.log("here"+ $routeParams.id)
  $http.get('/services/course/' + $routeParams.id).
  success(function(data){
    $scope.course = data.entityinfo;
  });

  $scope.deleteCourse = function(){
    $http.delete('/services/course/' + $routeParams.id+'/edit/'+$routeParams.id).
    success(function(data){
      $location.path('/courses');
    });
  };

  $scope.home = function(){
    $location.url('/courses');
  };
};
