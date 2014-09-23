'use strict';


//new changes with ui-grid

/* Controllers */
function TeacherIndexCtrl($scope, $http, $location) {



  $scope.teachers = []; //initilising teachers
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
              url:"services/teachers",
              datatype : 'jsonp'
            },
            update : {
              url : function(e){
                console.log(e.models[0]);
                http.put('services/teacher/'+e.models[0].tid,e.models[0]).success(function(data){

                  console.log("success");

                })
              }

            },
            destroy : {
              url : function(e){
                console.log(e);
                 $http.delete('/services/teacher/' + e.models[0].tid+'/edit/'+e.models[0].tid).
                    success(function(data){
                   $location.path('/teachers');
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
                   id : 'tid',
                   fields: {
                       tid: { editable:false,type: "string" },
                       tname: { type: "string" },

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
    detailTemplate: kendo.template($("#template").html()),
    /*
    dataBound: function() {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
   */

    columns : [
      {
        title : 'Edit',
        template:'<a ng-href="teachers/{{dataItem.tid}}/edit"><center><i class="icon-pencil">Edit</i></center></a>',
        width : '60px'
      },
      {
        field:'tid',
        title : 'Teacher Id',
        width : '120px'
      },
      {
        field : 'tname',
        title : 'Teacher name',
        width : '180px'
      },
      {
        title : 'Enroll',
        template : '<a ng-href="teachers/enroll/{{dataItem.tid}}"><button class="btn btn-link">Enroll</button></a>',
        width : '120px'
      },
      {
        title : 'More',
        template : '<a ng-href="teachers/{{dataItem.tid}}"><i class="icon-link-2">More</i></a>',
        width : '120px'

      },
      { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
    ]

    }

    $scope.onSelection = function(kendoEvent) {
        var grid = kendoEvent.sender;
        var selectedData = grid.dataItem(grid.select());
        console.log(selectedData);
    }

    $scope.detailGridOptions = function(dataItem){
      console.log(dataItem);
      return {
            dataSource: {
                type: "json",
                transport: {
                    read: "/services/teacher/about/"+dataItem.tid,
                    datatype : 'jsonp'
                },

                pageSize: 2,
                schema: {
                data : 'entityinfo',
                model: {
                    id : 'sid',
                    fields: {
                       cid: { editable:false },
                       cname: { type: "string" },


                    }
                 },
                total: "entityinfo.length"
            },

            },


            sortable: true,
            pageable:{
                pageSize : 2,
                refresh : true,
                pageSizes : false
            },
            columns: [
                { field: "cid", title:"CouseId", width: "56px" },
                { field: "cname", title:"CourseName", width: "110px" },


            ]
        };
    }




}



function ReadTeacherCtrl($scope, $http, $routeParams) {
  console.log($routeParams.id+"  ididi");
  $http.get('/services/teacher/' + $routeParams.id).
  success(function(data){
    $scope.teacher = data.entityinfo;
  });
}

function DetailTeacherCtrl($scope, $http, $routeParams) {
  console.log($routeParams.id+"  ididi");
  $http.get('/services/teacher/about/'+ $routeParams.id).
  success(function(data){
    $scope.teacher = data.entityinfo;
  });
}

function AddTeacherCtrl($scope, $http, $location) {
  //console.log($location.path('/'));
  $scope.form = {};

  $scope.submitTeacher = function(){
    $http.post('/services/newTeacher', $scope.form).
    success(function(data){
      $location.path('/teachers');
    });
  };
}


function EditTeacherCtrl($scope, $http, $location, $routeParams) {


  console.log($routeParams.id);
  $http.get('/services/teacher/' + $routeParams.id).
  success(function(data){
    $scope.form = data.entityinfo;
  });

  $scope.editTeacher = function(){
    $http.put('/services/teacher/' + $routeParams.id, $scope.form).
    success(function(data){
      $location.path('/teachers/' + $routeParams.id);
    });
  };


  $scope.cancel = function(){
    $location.path('/teachers');
  }

}


function DeleteTeacherCtrl($scope, $http, $location, $routeParams) {


  console.log("here"+ $routeParams.id)
  $http.get('/services/teacher/' + $routeParams.id).
  success(function(data){
    $scope.teacher = data.entityinfo;
  });

  $scope.deleteTeacher = function(){
    $http.delete('/services/teacher/' + $routeParams.id+'/edit/'+$routeParams.id).
    success(function(data){
      $location.path('/teachers');
    });
  };

  $scope.home = function(){
    $location.url('/teachers');
  };
};


function isSelected(element,index,array)
{
  if(element.ticked)
    {
      return element.id;
    }
}

function EnrollTeacherCtrl($scope,$http, $location, $routeParams,$timeout) {
  console.log("enrolling "+$routeParams.id);
  var teacherRecord = {};
  teacherRecord.tid = $routeParams.id;

  for(var elem in  $routeParams)
  {
    console.log(elem + "->"+ $routeParams[elem]);
  }

  $http.get('/services/teacher/' + $routeParams.id).
  success(function(data){
    $scope.teacher = data.entityinfo;
    console.log($scope.teacher);
  });



  //get for getting course list


  $http.get('/services/teacher/enroll/'+$routeParams.id).
  success(function(data){
     $scope.courseList = data.courseList;

     for(var i in $scope.courseList)
     {
       i.ticked = false;

     }

     console.log($scope.courseList);
  });




  $scope.enrollTeacher = function()
  {
    var selectedCourses = [];

    angular.forEach($scope.courseList,function(value,key){

      if(value.ticked)
      {
        this.push(value.cid);
      }

    },selectedCourses);
    teacherRecord.courses = selectedCourses;

    $http.post('/services/teacher/teacherEnrollment',teacherRecord)
    .success(function(data){
      $location.path('/teachers/about/' + $routeParams.id)
    });

    console.log(teacherRecord);


  }


}
