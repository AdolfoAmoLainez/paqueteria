const express = require("express");
const SelfApiController = require("../controllers/selfapi");

const router = express.Router();

router.get('/getUserData', SelfApiController.getUserData);
router.post('/deltaula', SelfApiController.esborraTaula);
router.post('/creataula', SelfApiController.creaTaula);
router.post('/enviaMailRemitent', SelfApiController.enviaMailRemitent);
router.post('/paquetqr/signar', SelfApiController.paquetQrSignar);
router.post('/paquetqr/get', SelfApiController.paquetQrGet);
