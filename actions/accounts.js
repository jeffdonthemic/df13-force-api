var forcifier = require("forcifier")
  , request = require("request")
  , Q = require("q");

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

/**
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

    fetchSalesforceRecord().then(function(account) {
      fetchStockPrice(account).then(function(price){
        // 'deforce' the returned record
        var record = forcifier.deforceJson(account);
        // add in the stock price
        record.stockPrice = price;
        connection.response.response = record;
        next(connection, true);
      })
    })
    .fail(function(error){
      returnError(connection, error);
      next(connection, true);
    });

    function fetchSalesforceRecord() {
      var deferred = Q.defer();
      var query = "select id, name, accountnumber, tickersymbol, active__c from account where id = '" +  connection.params.id + "'";
      api.sfdc.org.query(query, api.sfdc.oauth, function (err, resp) {
        if (err) { deferred.reject(err); }     
        if (!err) { deferred.resolve(resp.records[0]); } 
      })   
      return deferred.promise; 
    }

    function fetchStockPrice(account) {
      var deferred = Q.defer();
      request("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + account.TickerSymbol + "%22)&env=http://datatables.org/alltables.env&format=json", function (err, response, body) {
        if (err) { deferred.reject(err); }
        if (!err && response.statusCode == 200) {
          var quote = JSON.parse(body).query.results.quote;
          deferred.resolve(quote.PreviousClose);
        }
      })      
      return deferred.promise; 
    }

  }
};
**/