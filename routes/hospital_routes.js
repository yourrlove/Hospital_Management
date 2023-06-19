const express = require('express');
const lobby_routes = require('../controllers/hospital/lobby');
const reception_routes = require('../controllers/hospital/reception');
const doctorRooms_routes = require('../controllers/hospital/doctor_room')

const router = express.Router();

router.get('/lobby', lobby_routes.getLobby);

router.post('/lobby', lobby_routes.postLobby);

router.get('/reception', reception_routes.getReception);

router.get('/doctor_room/:roomID', doctorRooms_routes.getDoctorRooms);
module.exports = router;