/* Create database connetion */
var mysql = require('mysql');

var mysqlOptions = {
  host:'localhost',
  user:'paqueteria',
  password:'paqueteria',
  database:'paqueteria'
};

var connection=mysql.createPool(mysqlOptions);

/* Setting parameters for API url customization */
var settingOptions = {
    apiURL:'api', // Custom parameter to create API urls
    paramPrefix:'_' // Parameter for field seperation in API url
};

/* Setting options to handle cross origin resource sharing issue */
var corsOptions = {
  origin: "*", // Website you wish to allow to connect
  methods: "GET, POST, PUT, DELETE", // Request methods you wish to allow
  preflightContinue: false,
  optionsSuccessStatus: 200,
  allowedHeaders: "Content-Type, access-control-allow-origin, Authorization",
  credentials: true // Set to true if you need the website to include cookies in the requests sent,

};


isUserOnDB = function (userId, httpres, callbackFunc){

    connection.query("SELECT * FROM usuaris WHERE niu = ?" ,[userId],function(error,results,fields){
      if (error){
        callbackFunc([],httpres,userId);
      }else{
        callbackFunc(results,httpres,userId);
      }
    } );

}




module.exports={connection, settingOptions, corsOptions, isUserOnDB};
