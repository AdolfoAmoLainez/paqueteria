var dbconfig = require('../mysqlconn');

exports.isUserOnDB = (userId, callbackFunc) => {

  connection.query("SELECT * FROM usuaris WHERE niu = ?" ,[userId],function(error,results,fields){
    if (error){
      callbackFunc(500);
      // callbackFunc([],httpres,userId);
    }else{
      if (results.length === 1){
        callbackFunc(200);
      } else {
        callbackFunc(401);
      }
    }
  } );

}

/**
 * Request:
 *  username: niu de l'usuari
 * Response:
 *  200 => {id, username, tablename,ubicacioemail,gestoremail}
 *  401 => {status, message: 'Usuari o password incorrectes'}
 *  500 => Error al fer consulta BBDD
 */

exports.getUserData = (username) => {

  dbconfig.connection.query(
    "SELECT * FROM usuaris WHERE niu = ?" ,[username],
    (errorSel, results) => {
    if (!errorSel){
      console.log(results);
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

    } else {
      console.log(errorSel);

      callback(500);
    }
  });
}

/**
 * Request:
 *  tablename
 */

exports.esborraTaula = (req, res) => {

  nomTaula = req.body.tablename;

  sql = "DROP TABLE `"+nomTaula+"`;";

  connection.query(sql, function(error,results){

    if(error){
      httpres.status(498).json({status:'498',message: error.code+": "+ error.sqlMessage});
    }else{
      httpres.status(200).json(results);
    }
  });
}

/**
 * Crea una nova taula de paquests des de la buida
 */

exports.creaTaula = (req,res)=>{

  if (req.session.cas && req.session.cas.user) {
      dbconfig.creaTaula(req.body.tablename,res,(error,results) =>{
        if(error){
          res.status(498).json({status:'498',message: error.code+": "+ error.sqlMessage});
      }else{
          res.status(200).json(results);
      }
      });
  } else {
      res.status(401).json({message: 'Usuari no valid!'})
  }

}

/**
 * Request:
 * id: Numero de registre
 * gestoremail: from
 * emailremitent: to
 *
 * Response:
 * 200: ok o ko
 */

exports.enviaMailRemitent= (req,res) => {
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

}

/**
 * Request:
 *   body = paquet {tablename, dispositari, signatura, id}
 * Response:
 *   200 = Resultado BBDD
 *   499 = Error en la consulta BBDD
 */

exports.paquetQrSignar = (req,res) => {
  //console.log(req.body);

  paquet = req.body;

  dbconfig.query("UPDATE "+paquet.tablename+" SET `dipositari` = ?, `signatura` = ?, `qrcode` = 0 WHERE `id` = ?" ,
  [paquet.dipositari,paquet.signatura,paquet.id],function(error,results){
    if(error){
      res.status(499).json({status:'499',message: error.code+": "+ error.sqlMessage})
    }else{
        res.status(200).json(results);
    }
  } );

}

/**
 * Request:
 * tablename
 * id
 * qrcode
 *
 */

exports.paquetQrGet=(req,res) => {

  tablename = req.body.tablename;
  id = req.body.id;
  qrcode = req.body.qrcode;

  connection.query("SELECT * FROM "+tablename+" WHERE id = ? AND qrcode = ?" ,[id,qrcode],function(error,results){
    if(error){
        res.status(499).json({status:'499',message: error.code+": "+ error.sqlMessage})
    }else{
        res.status(200).json(results);
    }
  } );

}


