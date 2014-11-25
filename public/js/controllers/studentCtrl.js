'use strict';


//new changes with ui-grid
//latest change using kendo-ui

/* Controllers */
var socket = io('http://localhost:3001');
function StudentIndexCtrl($scope, $http, $location) {



  socket.on('edit:Student',function(data){

    $scope.studentGrid.dataSource.read();

  });


  socket.on('add:Student',function(data){

    $scope.studentGrid.dataSource.read();

  });


  socket.on('delete:Student',function(data){

    $scope.studentGrid.dataSource.read();

  });
  $scope.students = []; //initialising students
  $scope.mySelections = [];


  //locate the controller which need any kind of service
  // var cellEditableTemplate = "<input style=\"width: 90%\" step=\"any\" type=\"text\" ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row)\"/>";


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
              url:"services/students",
              datatype : 'jsonp'
            },
            update : {
              url : function(e){
                console.log(e.models[0]);
                http.put('services/student/'+e.models[0].sid,e.models[0]).success(function(data){

                  console.log("success");

                })
              }

            },
            destroy : {
              url : function(e){
                console.log(e);
                 $http.delete('/services/student/' + e.models[0].sid+'/edit/'+e.models[0].sid).
                    success(function(data){
                   $location.path('/students');
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
                   id : 'sid',
                   fields: {
                       sid: { editable:false,type: "number" },
                       sname: { type: "string" },

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
        template:'<a ng-href="students/{{dataItem.sid}}/edit"><center><i class="icon-pencil">Edit</i></center></a>',
        width : '60px'
      },
      {
        field:'sid',
        title : 'Student Id',
        width : '120px'
      },
      {
        field : 'sname',
        title : 'Student name',
        width : '180px'
      },
      {
        title : 'Enroll',
        template : '<a ng-href="students/enroll/{{dataItem.sid}}"><button class="btn btn-link">Enroll</button></a>',
        width : '120px'
      },
      {
        title : 'More',
        template : '<a ng-href="students/{{dataItem.sid}}"><i class="icon-link-2">More</i></a>',
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
                    read: "/services/student/about/"+dataItem.sid,
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
                       tname : { type : "string"}

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
                { field: "tname", title:"TeacherName",width: "190px"  },

            ]
        };
    }



}



function ReadStudentCtrl($scope, $http, $routeParams) {
  //console.log(readEntity.student);
  $http.get('/services/student/' + $routeParams.id).
  success(function(data){
    $scope.student = data.entityinfo;
  });
}

function DetailStudentCtrl($scope, $http, $routeParams, $location) {
  console.log($routeParams.id+"  ididi");

  $scope.is404 = 1;
  $http.get('/services/student/about/'+ $routeParams.id).
  success(function(data){
    $scope.student = data.entityinfo;
  }).
  error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(data);
      console.log(status);
      $scope.is404 = 0;

  });
}


function AddStudentCtrl($scope, $http, $location) {
  //console.log($location.path('/'));
  $scope.form = {};

  $scope.submitStudent = function(){
    $http.post('/services/newStudent', $scope.form).
    success(function(data){
      $location.path('/students');
    });
  };
}


function EditStudentCtrl($scope, $http, $location, $routeParams) {


  console.log($routeParams.id);
  $http.get('/services/student/' + $routeParams.id).
  success(function(data){
    $scope.form = data.entityinfo;
  });

  $scope.editStudent = function(){
    $http.put('/services/student/' + $routeParams.id, $scope.form).
    success(function(data){
      $location.path('/students/' + $routeParams.id);
    });
  };

  $scope.cancel = function(){
    $location.path('/students');
  }

}


function DeleteStudentCtrl($scope, $http, $location, $routeParams) {


  console.log("here"+ $routeParams.id)
  $http.get('/services/student/' + $routeParams.id).
  success(function(data){
    $scope.student = data.entityinfo;
  });

  $scope.deleteStudent = function(){
    $http.delete('/services/student/' + $routeParams.id+'/edit/'+$routeParams.id).
    success(function(data){
      $location.path('/students');
    });
  };

  $scope.home = function(){
    $location.url('/students');
  };
};


function isSelected(element,index,array)
{
  if(element.ticked)
    {
      return element.id;
    }
}


//this controller is getting messy!!!!!!!!!!!!
function EnrollStudentCtrl($scope,$http, $location, $routeParams) {
  console.log("enrolling "+$routeParams.id);
  var studentRecord = {};
  studentRecord.sid = $routeParams.id;

  for(var elem in  $routeParams)
  {
    console.log(elem + "->"+ $routeParams[elem]);
  }

  $http.get('/services/student/' + $routeParams.id).
  success(function(data){
    $scope.student = data.entityinfo;
    console.log($scope.student);
  });


  //get for getting course list
  $http.get('/services/student/enroll/'+$routeParams.id).
  success(function(data){


      $scope.courseList = data.courseList;



     for(var i in $scope.courseList)
     {
       i.ticked = false;

     }

     $scope.user = {
    courses: []
  };

  console.log($scope.user.courses);
  $scope.checkAll = function() {
    $scope.user.courses = angular.copy($scope.courseList);
  };
  $scope.uncheckAll = function() {
    $scope.user.courses = [];
  };
  $scope.checkFirst = function() {
    $scope.user.courses.splice(0, $scope.user.courses.length);
    $scope.user.courses.push($scope.courseList[0]);
  };


  var userData = $scope.courseList ;

  //-------------------------------
  //-------------------------------
  //controller logic for dualList
  // init
  $scope.selectedA = [];
  $scope.selectedB = [];

  $scope.listA = userData.slice(0,$scope.courseList.length);
  $scope.listB = [];
  $scope.items = userData;

  $scope.checkedA = false;
  $scope.checkedB = false;

  function arrayObjectIndexOf(myArray, searchTerm, property) {
      for(var i = 0, len = myArray.length; i < len; i++) {
          if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
  }

  $scope.aToB = function() {
    for (i in $scope.selectedA) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedA[i], "cid");
      $scope.listB.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listA, $scope.selectedA[i], "cid");
      $scope.listA.splice(delId,1);
    }
    reset();
  };

  $scope.bToA = function() {
    for (i in $scope.selectedB) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedB[i], "cid");
      $scope.listA.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listB, $scope.selectedB[i], "cid");
      $scope.listB.splice(delId,1);
    }
    reset();
  };

  function reset(){
  	$scope.selectedA=[];
    $scope.selectedB=[];
    $scope.toggle=0;
  }

  $scope.toggleA = function() {

    if ($scope.selectedA.length>0) {
      $scope.selectedA=[];
    }
    else {
      for (i in $scope.listA) {
        $scope.selectedA.push($scope.listA[i].cid);
      }
    }
  }

  $scope.toggleB = function() {

    if ($scope.selectedB.length>0) {
      $scope.selectedB=[];
    }
    else {
      for (i in $scope.listB) {
        $scope.selectedB.push($scope.listB[i].cid);
      }
    }
  }

  $scope.drop = function(dragEl, dropEl, direction) {

    var drag = angular.element(dragEl);
    var drop = angular.element(dropEl);
    var id = drag.attr("data-id");
    var el = document.getElementById(id);

    if(!angular.element(el).attr("checked")){
      angular.element(el).triggerHandler('click');
    }

    direction();
    $scope.$digest();
  };
  //end of dualList controller logic
  //--------------------------------
  //----------------------------------


});

  $scope.enrollStudent = function()
  {
    var selectedCourses = [];

    angular.forEach($scope.courseList,function(value,key){

      if(value.ticked)
      {
        this.push(value.cid);
      }

    },selectedCourses);
    studentRecord.courses = selectedCourses;

    $http.post('/services/student/studentEnrollment',studentRecord)
    .success(function(data){
      $location.path('/students/about/' + $routeParams.id)
    });

    console.log(studentRecord);


  }



}
