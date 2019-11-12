var express = require('express');
https=require('https');
const FS = require('fs');
const path = require('path');
var mysql = require('mysql');
var mysqlrestapi  = require('./mysql-restapi');
var dbconfig = require('./connections');
var app = express();
var bodyParser = require('body-parser');
var cas = require('connect-cas');
var url = require('url');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const selfApiRoutes = require("./routes/selfapi");
const loginApiRoutes = require('./routes/loginapi');

const PORT = 55023;


// Your CAS server's hostname

cas.configure({ 'host': 'sacnt.uab.cat', 'protocol': 'https',
paths: {
        validate: '/validate',
        serviceValidate: '/p3/serviceValidate', // CAS 3.0
        proxyValidate: '/p3/proxyValidate', // CAS 3.0
        proxy: '/proxy',
        login: '/login',
        logout: '/logout'
    }
});

console.log(cas.configure());
var app = express();

app.use(cookieParser());

app.use(session({
	secret: 'your_secret_random_pass_frase',
        resave: false,
        saveUninitialized: true
	}
));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


/*La carpeta on es troben els fitxers estàtics
* per servir via http
*/
//app.use(cas.serviceValidate(), cas.authenticate(),express.static('public'));
app.use(express.static('public'));

var api = mysqlrestapi(app, dbconfig);
app.use("/selfapi", selfApiRoutes);
app.use("/loginapi", loginApiRoutes);


/*app.get('*', cas.serviceValidate(), cas.authenticate(),(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
})*/
app.get('*',(req,res)=>{

    res.sendFile(__dirname+'/public/index.html');

});

/**
 * Para poder arrancar el servidor con https
 * Hay que generar el certificado. Hemos creado uno autofirmado con
 *  openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /home/aamo/PaqueteriaServer/certs/paqueteria-selfsigned.key -out /home/aamo/PaqueteriaServer/certs/paqueteria-selfsigned.crt
 *
 * *
 */

var options = {
    key: FS.readFileSync(path.join(__dirname, './certs/paqueteria_uab_cat.key')),
    cert: FS.readFileSync(path.join(__dirname, './certs/paqueteria_uab_cat.crt'))
  };

/*app.listen(PORT, function(){
    console.log('Servidor escuchando por el puerto '+PORT);
});*/

https.createServer(options, app).listen(PORT, function() {
    console.log('API REST FUNCIONANDO con HTTPS ' + PORT);
  });
