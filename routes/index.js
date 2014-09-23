
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html');
};

exports.error = function(req,res){
  res.render('404.html');
};

exports.partials = function (req, res) {
  var name = req.params.name+".html";
  res.render('partials/' + name);
};

exports.Cpartials = function (req, res) {
  var name = req.params.name+".html";
  res.render('partials/course/' + name);
};

exports.Spartials = function (req, res) {
  var name = req.params.name+".html";
  res.render('partials/student/' + name);
};

exports.Tpartials = function (req, res) {
  var name = req.params.name+".html";
  res.render('partials/teacher/' + name);
};
