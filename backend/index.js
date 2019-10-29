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
	secret: 'your_secret_random_pass_frase',
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

app.post('/selfapi/enviaMail', (req,res,next) => {
	if (req.body.email!=undefined && req.body.email!=''){

      let code = shell.exec('echo \"Heu rebut un paquet amb n&uacute;mero de registre '+req.body.id+' i remitent '+
                             req.body.remitent+'. \nPodeu recollir-lo per '+req.body.ubicacioemail+'\"'+
		     ' | mail -aFrom:'+req.body.gestoremail+' -a "Content-type: text/html" -s \'Paquet rebut per part de '+req.body.remitent+'\' ' + req.body.email).code;
	  if (code !==0){
            res.status(200).json({ SendMail: 'ko' });
	  }else{
            res.status(200).json({ SendMail: 'ok' });
	  }
    }else{
        res.status(200).json({ SendMail: 'ko' });
    }

});


/* function getPaquetQrCallback(results, httpres, error){

    if(error){
        httpres.status(499).json({status:'499',message: error.code+": "+ error.sqlMessage})
    }else{
        httpres.status(200).json(results);
    }

} */

/**
 * Funció per tornar el paquet amb codi QR però
 * sense haver de estar validat. Pensat per accedir
 * des del movil, sense token
 */
/* app.post('/selfapi/paquetqr/get',(req,res) => {

    dbconfig.getPaquetQr(req.body.tablename,req.body.id, req.body.qrcode,res,getPaquetQrCallback);

}); */

/* function signaPaquetQrCallback(results, httpres, error){
    if(error){
        httpres.status(499).json({status:'499',message: error.code+": "+ error.sqlMessage})
    }else{
        httpres.status(200).json(results);
    }
} */

/**
 * Funció per signar el paquet amb codi QR però
 * sense haver de estar validat. Pensat per accedir
 * des del movil, sense token
 */

/* app.post('/selfapi/paquetqr/signar',(req,res) => {
    //console.log(req.body);
    dbconfig.signaPaquetQr(req.body,res,signaPaquetQrCallback);

}); */

/* function newTaulaCallback(results,httpres, error){
    if(error){
        httpres.status(498).json({status:'498',message: error.code+": "+ error.sqlMessage});
    }else{
        httpres.status(200).json(results);
    }
} */

/**
 * Funció per crear una nova taula copiada de la taula
 * buida d'exemple
 */
/* app.post('/selfapi/creataula', cas.serviceValidate(), (req,res)=>{

    if (req.session.cas && req.session.cas.user) {
        dbconfig.creaTaula(req.body.tablename,res,newTaulaCallback);
    } else {
        res.status(401).json({message: 'Usuari no valid!'})
    }

}); */

/* app.post('/selfapi/enviaMailRemitent', (req,res,next) => {
	if (req.body.emailremitent!=undefined && req.body.emailremitent!=''){

      let code = shell.exec('echo \"S\'ha recollit el paquet amb n&uacute;mero de registre '+req.body.id+' \"'+
		     ' | mail -aFrom:'+req.body.gestoremail+' -a "Content-type: text/html" -s \'Paquet entregat\' ' + req.body.emailremitent).code;
	  if (code !==0){
            res.status(200).json({ SendMail: 'ko' });
	  }else{
            res.status(200).json({ SendMail: 'ok' });
	  }
    }else{
        res.status(200).json({ SendMail: 'ko' });
    }

}); */

/* function delTaulaCallback(results,httpres, error){
    if(error){
        httpres.status(498).json({status:'498',message: error.code+": "+ error.sqlMessage});
    }else{
        httpres.status(200).json(results);
    }
} */

/**
 * Funció per esborrar la taula
 * d'un usuari
 */

/* app.post('/selfapi/deltaula', cas.serviceValidate(), (req,res)=>{

    if (req.session.cas && req.session.cas.user) {
        dbconfig.esborraTaula(req.body.tablename,res,delTaulaCallback);
    } else {
        res.status(401).json({message: 'Usuari no valid!'})
    }

}); */

/* app.get('/selfapi/getUserData', cas.serviceValidate(), cas.authenticate(), function(req, res) {
    if (req.session.cas && req.session.cas.user) {
        dbconfig.isUserOnDB(req.session.cas.user,'',res,verifyUserCallback);
    } else {
        res.status(401).json({message: 'Usuari no valid!'});
    }
}); */

app.use('/api', cas.serviceValidate(), function(req, res, next) {

    if (req.session.cas && req.session.cas.user) {
      next();
    } else {
        res.status(401).json({message: 'Usuari no valid!'});
    }
  });

/*   app.get('/selfapi/logout', function(req, res) {
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
 */

  function verifyUserCallback(results,httpres,username){
    if(results.length>0){

            let body = {
                id: 1,
                username: username,
                tablename: results[0].tablename,
                ubicacioemail: results[0].ubicacioemail,
                gestoremail: results[0].gestoremail
            };

            httpres.status(200).json(body)
    }else{
        console.log("verifyUserCallback: Usuari no trobat a la BBDD!!");
        const status = 401;
        const message = 'Usuari o password incorrectes';
        httpres.status(status).json({ status, message })
        console.log(message);
        return;
    }
}

function verifyUserlogin(results,httpres,username){
    if(results.length>0){
        httpres.redirect(302,'/login');
    }else{
        console.log("verifyUserCallback: Usuari no trobat a la BBDD!!");
        const status = 401;
        const message = 'Usuari o password incorrectes';
        httpres.status(status).json({ status, message })
        console.log(message);
        return;
    }
}

  // This route has the serviceValidate middleware, which verifies
  // that CAS authentication has taken place, and also the
  // authenticate middleware, which requests it if it has not already
  // taken place.

  app.get('/selfapi/login', cas.serviceValidate(), cas.authenticate(), function(req, res) {
    // Great, we logged in, now redirect back to the home page.
    //console.log("paso por login");
    dbconfig.isUserOnDB(req.session.cas.user,'',res,verifyUserlogin)

  });


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
    key: FS.readFileSync(path.join(__dirname, './certs/chaman_uab_cat.key')),
    cert: FS.readFileSync(path.join(__dirname, './certs/chaman_uab_cat.crt'))
  };

/*app.listen(PORT, function(){
    console.log('Servidor escuchando por el puerto '+PORT);
});*/

https.createServer(options, app).listen(PORT, function() {
    console.log('API REST FUNCIONANDO con HTTPS ' + PORT);
  });
