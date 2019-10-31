const express = require("express");
const SelfApiController = require("../controllers/selfapi");

const router = express.Router();

router.post('/getUserData', SelfApiController.getUserData);
router.post('/deltaula', SelfApiController.esborraTaula);
router.post('/creataula', SelfApiController.creaTaula);
router.post('/enviaMailRemitent', SelfApiController.enviaMailRemitent);
router.post('/enviaMail', SelfApiController.enviaMail);
router.post('/paquetqr/signar', SelfApiController.paquetQrSignar);
router.post('/paquetqr/get', SelfApiController.paquetQrGet);
router.post('/getCountPaquetsPerSignar', SelfApiController.getCountPaquetsPerSignar);
router.post('/getPaquetsPerSignar', SelfApiController.getPaquetsPerSignar);
router.post('/getCountPaquetsSignats', SelfApiController.getCountPaquetsSignats);
router.post('/getPaquetsSignats', SelfApiController.getPaquetsSignats);

module.exports = router;
