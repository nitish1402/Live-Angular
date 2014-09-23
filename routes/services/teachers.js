'use strict'
//start trying to get database services from here as a module

var ser          = require('./services');

//GET
exports.teachers = function(req, res) {
  var sql = 'SELECT * FROM teacher ORDER BY tid';
  ser.entities(req,res,sql);
};

//GET for more info
exports.readTeacher = function(req, res) {
  var sql = 'SELECT * FROM teacher WHERE tid = $1';
  ser.readEntity(req,res,sql);
};

//GET about
exports.detailedTeacher = function(req,res)
{
  var sql = 'SELECT * FROM teacher t,course c,teaches t1 WHERE t1.cid = c.cid AND t.tid = t1.tid AND t.tid=$1';
  ser.detailedEntity(req,res,sql);
}

//POST
exports.addTeacher = function(req,res){
  var sql = "INSERT INTO teacher(tid,tname) VALUES($1,$2)";
  ser.addEntity(req,res,sql);
};

//EDIT
exports.editTeacher = function(req,res){
  var change = {};
  change.name = req.body.tname;
  var sql = 'UPDATE teacher SET tname = $1 '+' WHERE tid=$2;';
  ser.editEntity(req,res,sql,change);
};

//DELETE
exports.deleteTeacher = function(req,res){
  var sql = 'DELETE FROM teacher WHERE tid=$1';
  ser.deleteEntity(req,res,sql);
};


//Enroll teacher for courses
exports.enrollTeacher = function(req,res){
  ser.enrollEntity(req,res);
};


exports.submitTeacherEnrollment = function(req,res){
  var courseArr = req.body.courses;
  var sql = "INSERT INTO teaches VALUES";
  courseArr.forEach(function(element,index,array){

    sql +='('+'\''+element+'\''+','+'\''+req.body.tid+'\''+')';
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
