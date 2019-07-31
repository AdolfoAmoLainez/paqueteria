var express = require('express');
https=require('https');
const FS = require('fs');
const path = require('path');
var mysql = require('mysql');
var mysqlrestapi  = require('./mysql-restapi');
var dbconfig = require('./connections');
var app = express();
var bodyParser = require('body-parser');
const shell = require('shelljs');
var cas = require('connect-cas');
var url = require('url');
var session = require('express-session');
var cookieParser = require('cookie-parser');

const PORT = 55023;


// Your CAS server's hostname

cas.configure({ 'host': 'sso.uab.cat', 'protocol': 'https',
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
// Use cookie sessions for simplicity, you can use something else
//app.use(express.cookieParser('this should be random and secure'));
//app.use(express.cookieSession());
app.use(session({
	secret: 'FljhP)/&|a"N>0JDxzpDo0;Vx-u9vd3^#qDHCw6!(w73<hBmH;A+S`C^XJU8H',
        resave: false,
        saveUninitialized: true
	}
));

var api = mysqlrestapi(app, dbconfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


/*La carpeta on es troben els fitxers estàtics
* per servir via http
*/
//app.use(cas.serviceValidate(), cas.authenticate(),express.static('public'));
app.use(express.static('public'));


/**
 * A partir d'aquí definim els middlewares que farem servir
 *
 * Si volem que es verifiqui que l'usuari ha validat contra CAS
 * EX: app.post('/selfapi/example', cas.serviceValidate(), (req,res)=>{..});
 *
 * Si volem que verifiqui i validi
 * Ex: app.get('/selfapi/example', cas.serviceValidate(), cas.authenticate(), function(req, res) {..});
 *
 * Si volem un middleware sense validar amb CAS
 * Ex: app.post('/selfapi/example', (req,res,next) => {..});
 *
 * Si fem servir MysqlRest-Api forçem que l'usuari estigui validat per poder accedir via REST
 * Ex: app.use('/api', cas.serviceValidate(), function(req, res, next) {
      if (req.session.cas && req.session.cas.user) {
        next();
        } else {
            res.status(401).json({message: 'Usuari no valid!'});
      }});
 */


app.use('/api', cas.serviceValidate(), function(req, res, next) {

    if (req.session.cas && req.session.cas.user) {
      next();
    } else {
        res.status(401).json({message: 'Usuari no valid!'});
    }
  });

/**
 * Funció per fer logout del CAS
 */

  app.get('/selfapi/logout', function(req, res) {
    if (!req.session) {
      return res.redirect('/selfapi/login');
    }
    // Forget our own login session
    if (req.session.destroy) {
      req.session.destroy();
    } else {
      // Cookie-based sessions have no destroy()
      req.session = null;
    }
    // Send the user to the official campus-wide logout URL
    var options = cas.configure();
    options.pathname = options.paths.logout;
    return res.redirect(url.format(options));
  });


  // This route has the serviceValidate middleware, which verifies
  // that CAS authentication has taken place, and also the
  // authenticate middleware, which requests it if it has not already
  // taken place.

  app.get('/selfapi/login', cas.serviceValidate(), cas.authenticate(), function(req, res) {
    // Great, we logged in, now redirect back to the home page.
    //Si arribem aquí és que hem pogut validar. Redireccionem a la URL adequada si escau
        httpres.redirect(302,'/login');

  });


/**
 * En cas de tenir una app Angular al public, si no encaixa cap middleware
 * redireccionem sempre a l'index.html per tal que sigui el router de Angular
 * qui pugui decidir.
 */

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
    key: FS.readFileSync(path.join(__dirname, './certs/chaman_uab_cat.key')),
    cert: FS.readFileSync(path.join(__dirname, './certs/chaman_uab_cat.crt'))
  };

/*app.listen(PORT, function(){
    console.log('Servidor escuchando por el puerto '+PORT);
});*/

https.createServer(options, app).listen(PORT, function() {
    console.log('API REST FUNCIONANDO con HTTPS ' + PORT);
  });
