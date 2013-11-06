var forcifier = require("forcifier");

exports.action = {
  name: "accountsList",
  description: "Returns all accounts",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,  
  blockedConnectionTypes: [],
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
      api.sfdc.org.apexRest({ uri: 'v1/accountsList' }, api.sfdc.oauth, function(err, res) {
        if (err) { returnError(connection, err); }
        if (!err) { returnRecords(connection, res); }
        next(connection, true);
      });
  }
};

exports.accountsDetail = {
  name: "accountsDetail",
  description: "Returns a specific account by id",
  inputs: {
    required: ['id'],
    optional: [],
  },
  authenticated: false,    
  blockedConnectionTypes: [],
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    var query = "select id, name, accountnumber, tickersymbol, active__c from account where id = '" +  connection.params.id + "'";
    api.sfdc.org.query(query, api.sfdc.oauth, function (err, resp) {
      if (err) { returnError(connection, err); }     
      if (!err) { returnRecords(connection, resp.records[0]); } 
      next(connection, true);
    })   
  }
};

function returnRecords(connection, data) {
  connection.response.response = forcifier.deforceJson(data);
}

function returnError(connection, err) {
  connection.response.error= err;
  connection.rawConnection.responseHttpCode = 500; 
}