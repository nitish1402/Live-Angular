'use strict'
//start trying to get database services from here as a module

module.exports = function(io){
  var ser          = require('./services')(io);

  //GET
  function teachers(req, res) {
    var sql = 'SELECT * FROM teacher ORDER BY tid';
    ser.entities(req,res,sql);
  };

  //GET for more info
  function readTeacher(req, res) {
    var sql = 'SELECT * FROM teacher WHERE tid = $1';
    ser.readEntity(req,res,sql);
  };

  //GET about
  function detailedTeacher(req,res)
  {
    var sql = 'SELECT * FROM teacher t,course c,teaches t1 WHERE t1.cid = c.cid AND t.tid = t1.tid AND t.tid=$1';
    ser.detailedEntity(req,res,sql);
  }

  //POST
  function addTeacher(req,res){
    var sql = "INSERT INTO teacher(tid,tname) VALUES($1,$2)";
    io.sockets.emit('add:Teacher',{});
    ser.addEntity(req,res,sql);
  };

  //EDIT
  function editTeacher(req,res){
    var change = {};
    change.name = req.body.tname;
    var sql = 'UPDATE teacher SET tname = $1 '+' WHERE tid=$2;';
    io.sockets.emit('edit:Teacher',{});
    ser.editEntity(req,res,sql,change);
  };

  //DELETE
  function deleteTeacher(req,res){
    var sql = 'DELETE FROM teacher WHERE tid=$1';
    io.sockets.emit('delete:Teacher',{});
    ser.deleteEntity(req,res,sql);
  };


  //Enroll teacher for courses
  function enrollTeacher(req,res){
    ser.enrollEntity(req,res);
  };


  function submitTeacherEnrollment(req,res){
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

    return {
      teachers : teachers,
      addTeacher: addTeacher,
      editTeacher : editTeacher,
      deleteTeacher : deleteTeacher,
      readTeacher : readTeacher,
      detailedTeacher : detailedTeacher,
      enrollTeacher : enrollTeacher,
      submitTeacherEnrollment : submitTeacherEnrollment,
    }



}
