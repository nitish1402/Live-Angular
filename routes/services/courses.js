'use strict'
//start trying to get database services from here as a module



module.exports = function(io){

  var ser         = require('./services')(io);
  //GET
  function  courses(req, res) {
    var sql = 'SELECT * FROM course ORDER BY cid';
    ser.entities(req,res,sql);
  };

  //GET for more info
  function  readCourse(req, res) {
    var sql = 'SELECT * FROM course WHERE cid = $1';
    ser.readEntity(req,res,sql);
  };

  //POST
  function  addCourse(req,res){
    var sql = "INSERT INTO course(cid,cname) VALUES($1,$2)";
    io.sockets.emit('add:Course',{});
    ser.addEntity(req,res,sql);
  };

  //EDIT
  function  editCourse(req,res){
    var change  = {};
    change.name = req.body.cname;
    var sql     = 'UPDATE course SET cname = $1 '+' WHERE cid=$2;';
    io.sockets.emit('edit:Course',{});
    ser.editEntity(req,res,sql,change);
    console.log("editing");
  };

  //DELETE
  function  deleteCourse(req,res){
    var sql = 'DELETE FROM course WHERE cid=$1';
    io.sockets.emit('delete:Course',{});
    ser.deleteEntity(req,res,sql);
  };

  return {
    courses : courses,
    addCourse : addCourse,
    editCourse : editCourse,
    deleteCourse : deleteCourse,
    readCourse : readCourse,
  }

}



/*
function  ws(socket){
  socket.on('edit:course',function(){
    console.log("something changing here");

  });
};
*/
