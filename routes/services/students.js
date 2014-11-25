'use strict'
//start trying to get database services from here as a module


module.exports = function(io){
  var ser          = require('./services')(io);

  //GET
  function students(req, res) {
    var sql = 'SELECT * FROM student ORDER BY sid';
    ser.entities(req, res, sql);
  };

  //GET for more info
  function readStudent(req, res) {
    var sql = 'SELECT * FROM student WHERE sid=$1';
    ser.readEntity(req,res,sql);
  };

  //GET about
  function detailedStudent(req,res)
  {
    var sql = 'SELECT * FROM student s,enrollment e,course c,teaches t,teacher t1 WHERE s.sid = e.sid AND e.cid = c.cid  AND (e.cid=t.cid AND t.tid=t1.tid) AND s.sid=$1';
    console.log(sql);
    ser.detailedEntity(req,res,sql);
  };

  //POST
  function addStudent(req,res){
    var sql = "INSERT INTO student(sid,sname) VALUES($1,$2)";
    io.sockets.emit('add:Student',{});
    ser.addEntity(req,res,sql);
  };

  //EDIT
  function editStudent(req,res){
    var change  = {};
    change.name = req.body.sname;
    var sql     = 'UPDATE student SET sname = $1 '+' WHERE sid=$2;';
    io.sockets.emit('edit:Student',{});
    ser.editEntity(req,res,sql,change);
  };

  //DELETE
  function deleteStudent(req,res){
    var sql = 'DELETE FROM student WHERE sid=$1';
    io.sockets.emit('delete:Student',{});
    ser.deleteEntity(req,res,sql);
  };

  //Enroll student for courses
  function enrollStudent(req,res){
    ser.enrollEntity(req,res);
  };

  function submitEnrollment(req,res){
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

  return {
    students : students,
    addStudent: addStudent,
    editStudent : editStudent,
    deleteStudent : deleteStudent,
    readStudent : readStudent,
    detailedStudent : detailedStudent,
    enrollStudent : enrollStudent,
    submitEnrollment : submitEnrollment,
  }


}

//pg.end();
