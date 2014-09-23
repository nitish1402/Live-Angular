'use strict'
//start trying to get database services from here as a module
var ser          = require('./services');

//GET
exports.students = function(req, res) {
  var sql = 'SELECT * FROM student ORDER BY sid';
  ser.entities(req, res, sql);
};

//GET for more info
exports.readStudent = function(req, res) {
  var sql = 'SELECT * FROM student WHERE sid=$1';
  ser.readEntity(req,res,sql);
};

//GET about
exports.detailedStudent = function(req,res)
{
  var sql = 'SELECT * FROM student s,enrollment e,course c,teaches t,teacher t1 WHERE s.sid = e.sid AND e.cid = c.cid  AND (e.cid=t.cid AND t.tid=t1.tid) AND s.sid=$1';
  console.log(sql);
  ser.detailedEntity(req,res,sql);
};

//POST
exports.addStudent = function(req,res){
  var sql = "INSERT INTO student(sid,sname) VALUES($1,$2)";
  ser.addEntity(req,res,sql);
};

//EDIT
exports.editStudent = function(req,res){
  var change  = {};
  change.name = req.body.sname;
  var sql     = 'UPDATE student SET sname = $1 '+' WHERE sid=$2;';
  ser.editEntity(req,res,sql,change);
};

//DELETE
exports.deleteStudent = function(req,res){
  var sql = 'DELETE FROM student WHERE sid=$1';
  ser.deleteEntity(req,res,sql);
};

//Enroll student for courses
exports.enrollStudent = function(req,res){
  ser.enrollEntity(req,res);
};

exports.submitEnrollment = function(req,res){
  var courseArr = req.body.courses;
  console.log(courseArr);

  var sql = "INSERT INTO enrollment VALUES";
  courseArr.forEach(function(element,index,array){

    sql +='('+req.body.sid+','+'\''+element+'\''+')';
    if(index!=array.length-1 && array.length>1)
    {
      sql+=',';
    }

    else
    {
      sql+=';';
    }

  });

  ser.submitEntityEnrollment(req,res,sql);
}

//pg.end();
