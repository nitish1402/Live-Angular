#Live Angular (PEAN App)#
Server side JavaScript supporting RESTful web services for a CRUD application with an AngularJS front-end and nodejs for server and Postgres as database

##Demo##
Application is hosted at heroku : http://guarded-journey-4504.herokuapp.com/

##Requirements##
 * [Postgres](http://www.postgresql.org)
 * [Express](http://express.com)
 * [Nodejs](http://nodejs.org)
 * [AngularJs](http://angularjs.org)

##Setting up the database##

 * Create a database _universitynew_ in Postgres.
 * Dump university.sql file or copy paste its content into sql editor
 *  modifying dburl

   * go to ` /routes/services/services.js `
   * find  `var dbUrl = "postgres://nitish:nitish@localhost:5432/universitynew"`
   * change abovee line to `var dbUrl = "postgres://[Username]:[Password]@localhost:5432/universitynew";`
   * username and password are your Postgres authentication parameters.

##Installation##
 * Download and extract the repository.
 * Make sure that **npm** and **nodejs** are installed
 * run **npm install** in console
 * run **npm start**
 * In your browser open `http://localhost:3000`

##Future work##
  have to add socket.js support for live updates and enhance the app.

##Contact##

* [twitter](https://twitter.com/princeladdak)
