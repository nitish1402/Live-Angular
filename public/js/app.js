'use strict';

// Declare app level module which depends on filters, and services
//later make service each for student teacher and course
//latest chanege including kendo.directives in app
angular.module('myApp', [
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngRoute',
  'checklist-model',
  'lvl.directives.dragdrop',
  'multi-select',
  'ngSanitize', 
  'ngTouch',
  'kendo.directives'

])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 1000;
}])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index',
    //  controller: IndexCtrl
    }).
    when('/courses', {
      templateUrl: 'partials/course/course',
      controller: CourseIndexCtrl
    }).
    when('/courses/new', {
      templateUrl: 'partials/course/addCourse',
      controller: AddCourseCtrl
    }).
    when('/courses/:id', {
      templateUrl: 'partials/course/readCourse',
      controller: ReadCourseCtrl
    }).
    when('/courses/:id/edit', {
      templateUrl: 'partials/course/editCourse',
      controller: EditCourseCtrl
    }).
    when('/courses/:id/edit/:id/delete', {
      templateUrl: 'partials/course/deleteCourse',
      controller: DeleteCourseCtrl
    }).
    when('/students', {
      templateUrl: 'partials/student/student',
      controller: StudentIndexCtrl
    }).
    when('/students/new', {
      templateUrl: 'partials/student/addStudent',
      controller: AddStudentCtrl
    }).
    when('/students/:id', {
      templateUrl: 'partials/student/readStudent',
      controller: ReadStudentCtrl
    }).
    when('/students/:id/edit', {
      templateUrl: 'partials/student/editStudent',
      controller: EditStudentCtrl
    }).
    when('/students/:id/edit/:id/delete', {
      templateUrl: 'partials/student/deleteStudent',
      controller: DeleteStudentCtrl
    }).
    when('/students/about/:id',{
      templateUrl: 'partials/student/detailStudent',
      controller: DetailStudentCtrl
    }).
    when('/students/enroll/:id',{
      templateUrl:'partials/student/enrollStudent',
      controller: EnrollStudentCtrl
    }).
    when('/teachers', {
      templateUrl: 'partials/teacher/teacher',
      controller: TeacherIndexCtrl
    }).
    when('/teachers/new', {
      templateUrl: 'partials/teacher/addTeacher',
      controller: AddTeacherCtrl
    }).
    when('/teachers/:id', {
      templateUrl: 'partials/teacher/readTeacher',
      controller: ReadTeacherCtrl
    }).
    when('/teachers/:id/edit', {
      templateUrl: 'partials/teacher/editTeacher',
      controller: EditTeacherCtrl
    }).
    when('/teachers/:id/edit/:id/delete', {
      templateUrl: 'partials/teacher/deleteTeacher',
      controller: DeleteTeacherCtrl
    }).
    when('/teachers/about/:id',{
      templateUrl: 'partials/teacher/detailTeacher',
      controller: DetailTeacherCtrl
    }).
    when('/teachers/enroll/:id',{
      templateUrl:'partials/teacher/enrollTeacher',
      controller: EnrollTeacherCtrl
    }).
    otherwise({
      redirectTo: '/'
    });

   
 $locationProvider.html5Mode(true);

 //console.log("watch list :->"+$watch);
})
.controller('myController',['$scope','$location',activeBar]);

function activeBar($scope, $location)
{
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}
