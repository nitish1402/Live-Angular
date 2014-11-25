'use strict'
//start trying to get database services from here as a module

var pg               = require('pg');
pg.defaults.poolSize = 10;
var dbUrl            = "postgres://nitish:nitish@localhost:5432/universitynew";
var user             = {};

var courseList = [];
var entityarr = [];
//change in design earlier we were using pg.connect for each
//request now only one time at one session we will make the conncetion
pg.connect(dbUrl,function(err,client){
  if(err)
    {
      console.log("Error in connecting to the database")
    }
  else
    {
      user=client;
    }
});

function ServiceResult (status){
  this.output = new Array();
}

function processReqResSql(req, res, sql){
  //client.query() config value callback
  user.query(sql, function(err, result) {
    if(err)
      {
        console.log("Error in executing query!!");
        console.log(err);
      }
    else
      {
        //result.rows will give you the output of query
        //console.log("query is running successfully : ");
        var sr = new ServiceResult ('success');
        sr.output = result.rows;
        /*
        for (i = 0; i < result.rows.length; i++) {
          console.log(sr.output[i]);
        }
        */
        //console.log("mydata:->"+data)
        if(result.rows!==undefined)
        {
            res.json({entityarr:sr.output});
        }
        else res.send(404);
      }
    });
}



//GET for more info
function read(req, res,sql) {
  var id = req.params.id; //getting the id of request
  //console.log(req.params);
  //since we want final data to be object

  var entityinfo = {};
  user.query(sql,[id],function(err,result){
    if(err)
      {
        console.log("Error in performing query readCourse!!");
        console.log(err);
      }
    else
      {
        //query performed
        //because we are getting only one object here
        var sr = new ServiceResult ('success');
        sr.output = result.rows;
        if(result.rows!==undefined)
        {
            if(result.rows.length>0)
            {

               res.json({entityinfo:sr.output[0]});

            }


            else
            {
               res.writeHead(404, {'content-type': 'text/plain'});
               res.end('<p>The Server returned 404 </p>');
            }
        }
        else
          {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('<p>The Server returned 404 </p>');
          }
      }
    });


};

module.exports = function(io){

  //GET
  function  entities(req, res , sql) {
    processReqResSql(req, res, sql,entityarr);
  };

  function  detailedEntity(req,res,sql)
  {
    var id = req.params.id; //getting the id of request
    //  console.log(req.params);
    var entityinfo = {};
    user.query(sql,[id],function(err,result){
      if(err)
        {
          console.log("Error in performing query readStudent!!");
          console.log(err);
        }
      else
        {
          //query performed
          //because we are getting only one object here
          var sr = new ServiceResult ('success');
          sr.output = result.rows;
          if(result.rows!==undefined)
          {
              console.log(result.rows);
              console.log("length:"+result.rows.length);
              if(result.rows.length>0){
                res.status(200);
                res.json({entityinfo:result.rows});
                res.end();
            }

              else {
                 res.status(404).end();
              //   console.log("here here");
                 //res.end('<p>The Server returned 404 </p>');
               }
          }
          else {
            res.writeHead(404);
            res.end('<p>The Server returned 404 </p>');
          }
        }
      });

  };

  //POST
  function  addEntity(req,res,sql){
    //req.body is going to be the object of contents which we are entering
    //in form

    var datatoinsert = req.body;
    console.log(datatoinsert);
    console.log(sql);
    user.query(sql,
      [datatoinsert.id, datatoinsert.name],function(err,result){
        if(err)
          {
            console.log("in add student");
            console.log(err);
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('<p>The Server returned 404 </p>');
          }
        else
          {
          //  io.sockets.emit('add:Entity',{});
            res.status(200).end();
          }

        });
    };

    //EDIT
    function  editEntity(req,res,sql,change){

      var id = req.params.id;
      user.query(sql,[change.name,id],function(err,result){
        if(err)
          {
            console.log("Error in executing query editStudent!!");
            console.log(err);
          }
        else
          {
            //if we are editing rows then there must be a update on submit
            //checking result.rowCount
            if(result.rowCount>0)
              {
              //  io.sockets.emit('edit:Entity',{});

                res.status(200).end();
              }
            else
              {
                res.writeHead(404, {'content-type': 'text/plain'});
                res.end('<p>The Server returned 404 </p>');
              }

            }

          });
    };

    //DELETE
    function  deleteEntity(req,res,sql){
      var id = req.params.id;
      user.query(sql,[id],function(err,result){
        if(err)
          {
           console.log("Error in performing query deletStudent!!");
           console.log(err);
          }
        else
          {
           var count =result.rowCount;

           if(result.rowCount>0)
           {
          //   io.sockets.emit('delete:Entity',{});
            //console.log(result.rows);
            res.status(200).end();
            //res.writeHead(200,result);
           }
           else {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('<p>The Server returned 404 </p>');
           // return res.end("404'd")
          }
          }
        });

    };


    //Enroll student for courses
    function  enrollEntity(req,res){

      //id is required because we want to enroll a student to courses
      var id         = req.params.id;

      var sql1       = "SELECT * FROM course";

      user.query(sql1,function(err,result){
          if(err)
          {
            console.log("Error in enrollStudent");
            console.log(err);
          }
          else
          {
            var count = result.rowCount;
            //console.log(result.rows);
            if(result.rows!==undefined)
            {
                if(result.rows.length>0)
                {

                    res.json({courseList:result.rows});
                }

                else res.status(404);
            }
            else res.status(404);

          }
      });
      //now have to perform join

    };


    function  submitEntityEnrollment(req,res,sql){

      user.query(sql,function(err,result){
        if(err)
        {
          console.log("error in submitEnrollment");
          console.log(err);
          res.status(500).end(); //internal error
        }
        else
        {
        //  io.sockets.emit('enroll:Entity',{});
          res.status(200).end();;
        }
      });
    }


      return {
        readEntity : read,
        addEntity : addEntity,
        entities : entities,
        editEntity : editEntity,
        deleteEntity : deleteEntity,
        detailedEntity : detailedEntity,
        submitEntityEnrollment : submitEntityEnrollment,
        enrollEntity : enrollEntity,
      }






//function  readEntity = read;
//GET about







//  console.log(sql);

}
