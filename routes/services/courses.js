'use strict'
//start trying to get database services from here as a module
var ser         = require('./services');

//GET
exports.courses = function(req, res) {
  var sql = 'SELECT * FROM course ORDER BY cid';
  ser.entities(req,res,sql);
};

//GET for more info
exports.readCourse = function(req, res) {
  var sql = 'SELECT * FROM course WHERE cid = $1';
  ser.readEntity(req,res,sql);
};

//POST
exports.addCourse = function(req,res){
  var sql = "INSERT INTO course(cid,cname) VALUES($1,$2)";
  ser.addEntity(req,res,sql);
};

//EDIT
exports.editCourse = function(req,res){
  var change  = {};
  change.name = req.body.cname;
  var sql     = 'UPDATE course SET cname = $1 '+' WHERE cid=$2;';
  ser.editEntity(req,res,sql,change);
  console.log("editing");
};

//DELETE
exports.deleteCourse = function(req,res){
  var sql = 'DELETE FROM course WHERE cid=$1';
  ser.deleteEntity(req,res,sql);
};


/*
exports.ws = function(socket){
  socket.on('edit:course',function(){
    console.log("something changing here");
    
  });
};
*/