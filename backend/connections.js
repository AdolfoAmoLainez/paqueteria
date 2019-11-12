/* Create database connetion */
var mysql = require('mysql');

var mysqlOptions = {
  host:'localhost',
  user:'paqueteria',
  password:'d172u^kJ',
  database:'paquets'
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

errorResponse = function (httpres, error) {
  console.log(error);
  switch (error.code){
    case 'ECONNREFUSED':
      httpres.status(500).json({status:500, message: 'Error al connectar a la BBDD.' });
      break;
    default:
      httpres.status(500).json({status:500, message: 'Hi ha hagut algun error amb la BBDD.' });
  }
}

/* isUserOnDB = function (userId, httpres, callbackFunc){

    connection.query("SELECT * FROM usuaris WHERE niu = ?" ,[userId],function(error,results,fields){
      if (error){
        errorResponse(httpres, error);
        // callbackFunc([],httpres,userId);
      }else{
        callbackFunc(results,httpres,userId);
      }
    } );

} */

/* getPaquetQr = function (tablename,id,qrcode, httpres, callbackFunc){
  connection.query("SELECT * FROM "+tablename+" WHERE id = ? AND qrcode = ?" ,[id,qrcode],function(error,results,fields){
    if (error){
      errorResponse(httpres, error);
      //callbackFunc([],httpres,error);
    }else{
      callbackFunc(results,httpres);
    }
  } );

} */

/* signaPaquetQr = function (paquet, httpres, callbackFunc){
  connection.query("UPDATE "+paquet.tablename+" SET `dipositari` = ?, `signatura` = ?, `qrcode` = 0 WHERE `id` = ?" ,
  [paquet.dipositari,paquet.signatura,paquet.id],function(error,results,fields){
    if (error){
      errorResponse(httpres, error);
      //callbackFunc([],httpres,error);
    }else{
      callbackFunc(results,httpres);
    }
  } );

} */

/* creaTaula = function (nomTaula, httpres,callbackFunc){
    sql = "CREATE TABLE `"+nomTaula+"` LIKE paquets_buida;";

  connection.query(sql, function(error,results,fields){

    if (error){
      errorResponse(httpres, error);
      //callbackFunc([],httpres,error);
    } else {
      callbackFunc(results,httpres);
    }
  });
} */

/* esborraTaula = function (nomTaula, httpres,callbackFunc){
  sql = "DROP TABLE `"+nomTaula+"`;";

  connection.query(sql, function(error,results,fields){

    if (error){
      errorResponse(httpres, error);
      //callbackFunc([],httpres,error);
    } else {
      callbackFunc(results,httpres);
    }
  });
} */


// module.exports={connection, settingOptions, corsOptions, isUserOnDB, getPaquetQr, signaPaquetQr,creaTaula,esborraTaula};
module.exports={connection, settingOptions, corsOptions};
