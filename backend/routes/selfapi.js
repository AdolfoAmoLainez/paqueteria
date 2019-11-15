const express = require("express");
const SelfApiController = require("../controllers/selfapi");

var cas = require('connect-cas');

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

const router = express.Router();

router.get('/getUserData', SelfApiController.getUserData);
router.post('/enviaMailRemitent', SelfApiController.enviaMailRemitent);
router.post('/paquetqr/signar', SelfApiController.paquetQrSignar);
router.post('/paquetqr/get', SelfApiController.paquetQrGet);
router.post('/enviaMail', cas.serviceValidate(), SelfApiController.enviaMail);
router.post('/deltaula', cas.serviceValidate(), SelfApiController.esborraTaula);
router.post('/creataula', cas.serviceValidate(), SelfApiController.creaTaula);
router.post('/getCountPaquetsPerSignar', cas.serviceValidate(), SelfApiController.getCountPaquetsPerSignar);
router.post('/getPaquetsPerSignar', cas.serviceValidate(), SelfApiController.getPaquetsPerSignar);
router.post('/getCountPaquetsSignats', cas.serviceValidate(), SelfApiController.getCountPaquetsSignats);
router.post('/getPaquetsSignats', cas.serviceValidate(), SelfApiController.getPaquetsSignats);

module.exports = router;
