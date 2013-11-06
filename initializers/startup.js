exports.startup = function(api, next){
  var task = new api.task({ name: "sfdcAccessToken"}).run();
  next();
}