var dbconfig = require('../connections');
const shell = require('shelljs');

/**
 * Funció per convertir caràcters especials a HTML
 * es fa servir per enviar el cos dels mails
 */

function char_convert(str) {

  var chars = ["©","Û","®","ž","Ü","Ÿ","Ý","$","Þ","%","¡","ß","¢","à","£","á","À","¤","â","Á","¥","ã","Â","¦","ä","Ã","§","å","Ä","¨","æ","Å","©","ç","Æ","ª","è","Ç","«","é","È","¬","ê","É","­","ë","Ê","®","ì","Ë","¯","í","Ì","°","î","Í","±","ï","Î","²","ð","Ï","³","ñ","Ð","´","ò","Ñ","µ","ó","Õ","¶","ô","Ö","·","õ","Ø","¸","ö","Ù","¹","÷","Ú","º","ø","Û","»","ù","Ü","@","¼","ú","Ý","½","û","Þ","€","¾","ü","ß","¿","ý","à","‚","À","þ","á","ƒ","Á","ÿ","å","„","Â","æ","…","Ã","ç","†","Ä","è","‡","Å","é","ˆ","Æ","ê","‰","Ç","ë","Š","È","ì","‹","É","í","Œ","Ê","î","Ë","ï","Ž","Ì","ð","Í","ñ","Î","ò","‘","Ï","ó","’","Ð","ô","“","Ñ","õ","”","Ò","ö","•","Ó","ø","–","Ô","ù","—","Õ","ú","˜","Ö","û","™","×","ý","š","Ø","þ","›","Ù","ÿ","œ","Ú"];
  var codes = ["&copy;","&#219;","&reg;","&#158;","&#220;","&#159;","&#221;","&#36;","&#222;","&#37;","&#161;","&#223;","&#162;","&#224;","&#163;","&#225;","&Agrave;","&#164;","&#226;","&Aacute;","&#165;","&#227;","&Acirc;","&#166;","&#228;","&Atilde;","&#167;","&#229;","&Auml;","&#168;","&#230;","&Aring;","&#169;","&#231;","&AElig;","&#170;","&#232;","&Ccedil;","&#171;","&#233;","&Egrave;","&#172;","&#234;","&Eacute;","&#173;","&#235;","&Ecirc;","&#174;","&#236;","&Euml;","&#175;","&#237;","&Igrave;","&#176;","&#238;","&Iacute;","&#177;","&#239;","&Icirc;","&#178;","&#240;","&Iuml;","&#179;","&#241;","&ETH;","&#180;","&#242;","&Ntilde;","&#181;","&#243;","&Otilde;","&#182;","&#244;","&Ouml;","&#183;","&#245;","&Oslash;","&#184;","&#246;","&Ugrave;","&#185;","&#247;","&Uacute;","&#186;","&#248;","&Ucirc;","&#187;","&#249;","&Uuml;","&#64;","&#188;","&#250;","&Yacute;","&#189;","&#251;","&THORN;","&#128;","&#190;","&#252","&szlig;","&#191;","&#253;","&agrave;","&#130;","&#192;","&#254;","&aacute;","&#131;","&#193;","&#255;","&aring;","&#132;","&#194;","&aelig;","&#133;","&#195;","&ccedil;","&#134;","&#196;","&egrave;","&#135;","&#197;","&eacute;","&#136;","&#198;","&ecirc;","&#137;","&#199;","&euml;","&#138;","&#200;","&igrave;","&#139;","&#201;","&iacute;","&#140;","&#202;","&icirc;","&#203;","&iuml;","&#142;","&#204;","&eth;","&#205;","&ntilde;","&#206;","&ograve;","&#145;","&#207;","&oacute;","&#146;","&#208;","&ocirc;","&#147;","&#209;","&otilde;","&#148;","&#210;","&ouml;","&#149;","&#211;","&oslash;","&#150;","&#212;","&ugrave;","&#151;","&#213;","&uacute;","&#152;","&#214;","&ucirc;","&#153;","&#215;","&yacute;","&#154;","&#216;","&thorn;","&#155;","&#217;","&yuml;","&#156;","&#218;"];

  for(x=0; x<chars.length; x++){
     str = str.replace(chars[x], codes[x]);
  }

  return str;
}


exports.isUserOnDB = (userId, callbackFunc) => {

  dbconfig.connection.query("SELECT * FROM usuaris WHERE niu = ?" ,[userId],function(error,results,fields){
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

exports.getUserData = (req, res) => {

  console.log('getUserData');

  //const username = req.body.username;


  if (typeof req.session.cas == 'undefined'){
    const status = 401;
    const message = 'Usuari no autoritzat';
    res.status(status).json({ status, message })
    return;
  }

  console.log(req.session.cas);

  const username = req.session.cas.user;


  dbconfig.connection.query(
    "SELECT * FROM usuaris WHERE niu = ?" ,[username],
    (errorSel, results) => {
    if (!errorSel){
      if(results.length>0){

        let body = {
            id: 1,
            username: username,
            tablename: results[0].tablename,
            ubicacioemail: results[0].ubicacioemail,
            gestoremail: results[0].gestoremail
        };

        res.status(200).json(body)
      }else{
          console.log("verifyUserCallback: Usuari no trobat a la BBDD!!");
          const status = 401;
          const message = 'Usuari o password incorrectes';
          res.status(status).json({ status, message })
          console.log(message);
          return;
      }

    } else {
      const status = 401;
      const message = 'Usuari no autoritzat';
      res.status(status).json({ status, message })
    }
  });
}

/**
 * Request:
 *  tablename
 */

exports.esborraTaula = (req, res) => {
  console.log("EsborraTaula");
  console.log(req.body);

  nomTaula = req.body.tablename;

  const sql = "DROP TABLE `"+nomTaula+"`;";

  dbconfig.connection.query(sql, function(error,results){

    if(error){
      res.status(498).json({status:'498',message: error.code+": "+ error.sqlMessage});
    }else{
      res.status(200).json(results);
    }
  });
}

/**
 * Crea una nova taula de paquests des de la buida
 * Request: Usuari
 *  id: number;
    niu: string;
    displayname: string;
    rol_id: number;
    tablename: string;
    ubicacioemail: string;
    gestoremail: string;
 *
 */

exports.creaTaula = (req,res)=>{
  console.log("Crar Taula");
  console.log(req.body);


  const nomTaula = req.body.tablename

  if (req.session.cas && req.session.cas.user) {
    sql = "CREATE TABLE `"+nomTaula+"` LIKE paquets_buida;";

    dbconfig.connection.query(sql, function(error,results){
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
 * Request
 *  id
 *  email
 *  remitent
 *  ubicacioemail
 *  gestoremail
 *
 * Response:
 *  200: ok o ko
 *
 */

exports.enviaMail = (req, res) => {

	if (req.body.email!=undefined && req.body.email!=''){

    const cuerpo = char_convert('echo \"Heu rebut un paquet amb n&uacute;mero de registre '+req.body.id+' i remitent '+
      req.body.remitent+'. \nPodreu recollir-lo per '+ req.body.ubicacioemail+'\"');

    const cmd = cuerpo + ' | mail -aFrom:'+req.body.gestoremail+
                ' -a "Content-type: text/html" -s "Paquet rebut per part de '+
                req.body.remitent+'" ' + req.body.email;

    let code = shell.exec(cmd).code;

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

  console.log("PaquetQrSignar");
  console.log(req.body);

  paquet = req.body;

  dbconfig.connection.query("UPDATE "+paquet.tablename+" SET `dipositari` = ?, `signatura` = ?, `qrcode` = 0 WHERE `id` = ?" ,
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

  dbconfig.connection.query("SELECT * FROM "+tablename+" WHERE id = ? AND qrcode = ?" ,[id,qrcode],function(error,results){
    if(error){
        res.status(499).json({status:'499',message: error.code+": "+ error.sqlMessage})
    }else{
        res.status(200).json(results);
    }
  } );

}

/**
 * Request:
 *  tablename: Nom de la taula de paquets
 *  searchText: Filtre a aplicar
 */

exports.getCountPaquetsPerSignar=(req,res) => {
  console.log('getCountPaquetsPerSignar');
  console.log(req.body);

  let sql = '';
  tablename = req.body.tablename;
  searchText = req.body.searchText;

  if (searchText!=undefined && searchText!=""){
    sql = "SELECT count(id) as totalpaquets FROM "+tablename+" WHERE (id LIKE '%" + searchText + "%' or " +
                                             "data_arribada LIKE '%"+searchText+"%' or " +
                                             "remitent LIKE '%"+searchText+"%' or "+
                                             "procedencia LIKE '%"+searchText+"%' or "+
                                             "mitja_arribada LIKE '%"+searchText+"%' or "+
                                             "referencia LIKE '%"+searchText+"%' or "+
                                             "destinatari LIKE '%"+searchText+"%' or "+
                                             "departament LIKE '%"+searchText+"%' or "+
                                             "data_lliurament LIKE '%"+searchText+"%' or "+
                                             "dipositari LIKE '%"+searchText+"%' "+
                                             ") AND signatura='empty';";

  }else{
      sql = "SELECT count(id) as totalpaquets FROM "+tablename+" WHERE signatura='empty'";
  }

  dbconfig.connection.query(
      sql,
      (errorSel, consulta) => {
      if (errorSel){
        res.status(499).json({message: "No s'ha pogut consultar el nombre de paquets."});
      } else {
        res.status(200).json(consulta);
      }
    });

}


/**
 * Request:
 *  tablename: Nom de la taula de paquets
 *  page: Numero de plana segons els itemsPerPage
 *  itemsPerpage: Numero de registes per plana
 *  searchText: Text de búsqueda, opcional
 */
exports.getPaquetsPerSignar = (req, res) => {
  console.log("getPaquetsPerSignar");
  console.log(req.body);

  const limit = ""+req.body.page+","+req.body.itemsPerpage;
  const searchText = req.body.searchText;
  const tablename = req.body.tablename;
  let sql = '';

  if (searchText!=undefined && searchText!=""){
    sql = "SELECT * FROM " + tablename + " WHERE (id LIKE '%" + searchText + "%' or " +
                                         "data_arribada LIKE '%"+searchText+"%' or " +
                                         "remitent LIKE '%"+searchText+"%' or "+
                                         "procedencia LIKE '%"+searchText+"%' or "+
                                         "mitja_arribada LIKE '%"+searchText+"%' or "+
                                         "referencia LIKE '%"+searchText+"%' or "+
                                         "destinatari LIKE '%"+searchText+"%' or "+
                                         "departament LIKE '%"+searchText+"%' or "+
                                         "data_lliurament LIKE '%"+searchText+"%' or "+
                                         "dipositari LIKE '%"+searchText+"%' "+
                                         ") AND signatura='empty' "+
                                         "ORDER BY STR_TO_DATE(data_arribada, '%d/%m/%Y %H:%i:%s') DESC " +
                                         "LIMIT " + limit+";";
  } else {
    sql ="SELECT * FROM " + tablename + " WHERE signatura='empty' ORDER BY STR_TO_DATE(data_arribada, '%d/%m/%Y %H:%i:%s') DESC " +
         "LIMIT " + limit+";"
  }

  dbconfig.connection.query(
    sql,
    (errorSel, consulta) => {
    if (errorSel){
      console.log(errorSel);

      res.status(499).json({message: "No s'ha pogut consultar el llistat de paquets."});
    } else {

      res.status(200).json({paquets:consulta});

    }
  });

}

/**
 * Request:
 *  tablename: Nom de la taula de paquets
 *  searchText: Filtre a aplicar
 */

exports.getCountPaquetsSignats=(req,res) => {
  console.log('getCountPaquetsSignats');
  console.log(req.body);

  let sql = '';
  tablename = req.body.tablename;
  searchText = req.body.searchText;

  if (searchText!=undefined && searchText!=""){
    sql = "SELECT count(id) as totalpaquets FROM "+tablename+" WHERE (id LIKE '%" + searchText + "%' or " +
                                             "data_arribada LIKE '%"+searchText+"%' or " +
                                             "remitent LIKE '%"+searchText+"%' or "+
                                             "procedencia LIKE '%"+searchText+"%' or "+
                                             "mitja_arribada LIKE '%"+searchText+"%' or "+
                                             "referencia LIKE '%"+searchText+"%' or "+
                                             "destinatari LIKE '%"+searchText+"%' or "+
                                             "departament LIKE '%"+searchText+"%' or "+
                                             "data_lliurament LIKE '%"+searchText+"%' or "+
                                             "dipositari LIKE '%"+searchText+"%' "+
                                             ") AND signatura NOT LIKE 'empty';";

  }else{
      sql = "SELECT count(id) as totalpaquets FROM "+tablename+" WHERE signatura NOT LIKE 'empty'";
  }

  dbconfig.connection.query(
      sql,
      (errorSel, consulta) => {
      if (errorSel){
        res.status(499).json({message: "No s'ha pogut consultar el nombre de paquets."});
      } else {
        res.status(200).json(consulta);
      }
    });

}

/**
 * Request:
 *  tablename: Nom de la taula de paquets
 *  page: Numero de plana segons els itemsPerPage
 *  itemsPerpage: Numero de registes per plana
 *  searchText: Text de búsqueda, opcional
 */
exports.getPaquetsSignats = (req, res) => {
  console.log("getPaquetsSignats");
  console.log(req.body);

  const limit = ""+req.body.page+","+req.body.itemsPerpage;
  const searchText = req.body.searchText;
  const tablename = req.body.tablename;
  let sql = '';

  if (searchText!=undefined && searchText!=""){
    sql = "SELECT * FROM " + tablename + " WHERE (id LIKE '%" + searchText + "%' or " +
                                         "data_arribada LIKE '%"+searchText+"%' or " +
                                         "remitent LIKE '%"+searchText+"%' or "+
                                         "procedencia LIKE '%"+searchText+"%' or "+
                                         "mitja_arribada LIKE '%"+searchText+"%' or "+
                                         "referencia LIKE '%"+searchText+"%' or "+
                                         "destinatari LIKE '%"+searchText+"%' or "+
                                         "departament LIKE '%"+searchText+"%' or "+
                                         "data_lliurament LIKE '%"+searchText+"%' or "+
                                         "dipositari LIKE '%"+searchText+"%' "+
                                         ") AND signatura NOT LIKE 'empty' "+
                                         "ORDER BY data_lliurament DESC " +
                                         "LIMIT " + limit+";";
  } else {
    sql ="SELECT * FROM " + tablename + " WHERE signatura NOT LIKE 'empty' ORDER BY data_lliurament DESC " +
         "LIMIT " + limit+";";
  }

  dbconfig.connection.query(
    sql,
    (errorSel, consulta) => {
    if (errorSel){
      console.log(errorSel);

      res.status(499).json({message: "No s'ha pogut consultar el llistat de paquets."});
    } else {

      res.status(200).json({paquets: consulta});

    }
  });

}
