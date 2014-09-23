/**
* Module dependencies
*/

// BASE SETUP
// ==============================================
var express        = require('express'); //required for choosing express service
var bodyParser     = require('body-parser'); //Middle ware for parsing data like JSON data
var methodOverride = require('method-override'); //provide PUT and DELETE where client doesn't support it
var morgan         = require('morgan'); //logging into the console
var routes         = require('./routes'); //requesting services from routes folder
var port           = process.env.PORT || 3000; //setting port
var router         = express.Router(); //using express router
var course         = require('./routes/services/courses');  //our CRUD services
var student        = require('./routes/services/students');  //our CRUD services
var teacher        = require('./routes/services/teachers');  //our CRUD services
var main           = require('./routes/services/services')
var app = module.exports = express();
var http = require('http').Server(app);
var io             = require('socket.io')(http);
// ===============================================

/**
* Configuration
*/

// all environments
app.use(bodyParser.json()); // parse application/json   // pull information from html in POST
app.use(methodOverride());                        // simulate DELETE and PUT
//app.use(morgan('dev')); 					              // log every request to the console
app.engine('html', require('ejs').renderFile);    // use ejs to render html
app.use(express.static(__dirname + '/public'));   // set the static files location /public/img will be /img for users
app.set('views', __dirname + '/views');
app.use('/', router);


var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  //configure stuff here
 // console.log('development')
}

router.get('/', routes.index);
router.get('/partials/:name', routes.partials);
router.get('/partials/course/:name', routes.Cpartials);
router.get('/partials/student/:name', routes.Spartials);
router.get('/partials/teacher/:name', routes.Tpartials);

//REST SERVICES FOR COURSES
router.post('/services/newCourse',course.addCourse);
router.get('/services/courses', course.courses);
router.get('/services/course/:id', course.readCourse);
router.put('/services/course/:id', course.editCourse);
router.delete('/services/course/:id/edit/:id', course.deleteCourse)


//REST SERVICES FOR STUDENTS
router.post('/services/newStudent',student.addStudent);
router.post('/services/student/studentEnrollment',student.submitEnrollment);
router.get('/services/students', student.students);
router.get('/services/student/enroll/:id',student.enrollStudent);
router.get('/services/student/:id', student.readStudent);
router.get('/services/student/about/:id', student.detailedStudent);
router.put('/services/student/:id', student.editStudent);
router.delete('/services/student/:id/edit/:id', student.deleteStudent)


//REST SERVICES FOR TEACHERS
router.post('/services/newTeacher',teacher.addTeacher);
router.post('/services/teacher/teacherEnrollment',teacher.submitTeacherEnrollment);
router.get('/services/teachers', teacher.teachers);
router.get('/services/teacher/enroll/:id',teacher.enrollTeacher);
router.get('/services/teacher/:id', teacher.readTeacher);
router.get('/services/teacher/about/:id', teacher.detailedTeacher);
router.put('/services/teacher/:id', teacher.editTeacher);
router.delete('/services/teacher/:id/edit/:id', teacher.deleteTeacher);

io.on('connection', function(socket){
	socket.on('edit:course',function(){
		console.log("editing course !!!");
		router.get('/services/course/:id', course.readCourse);

	})
});
/*
router.get('/services/product/:id', services.product);
router.put('/services/product/:id', services.editProduct);
router.delete('/services/product/:id/edit/:id', services.deleteProduct)
*/

router.get('*', routes.index);


/**
* Start Server
*/

http.listen(port);
//console.log('App listening on port ' + port);
