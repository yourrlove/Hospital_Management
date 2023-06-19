const express = require('express');
const lobby_routes = require('../controllers/admin/edit_lobby');
const reception_routes = require('../controllers/admin/edit_reception');
const doctorRooms_routes = require('../controllers/admin/edit_doctor_room');

const router = express.Router();

router.get('/edit_lobby', lobby_routes.getEditLobby);

router.get('/edit_reception', reception_routes.getEditReception);

router.get('/edit_doctor_room/:roomID', doctorRooms_routes.getEditDoctorRooms);

router.get('/patient/:patientID', reception_routes.getEditPatient);
                        
router.post('/patient', reception_routes.postEditPatient);

module.exports = router;