exports.routes = {

  get: [
    { path: "/:apiVersion/accounts/:id", action: "accountsDetail" },  
    { path: "/:apiVersion/accounts", action: "accountsList" }
  ]

};
