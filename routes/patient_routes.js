const express = require('express');
const reception_routes = require('../controllers/reception');


const router = express.Router();

router.get('/patient/:patientID', reception_routes.getPatient);
    
router.post('/patient', reception_routes.postPatient);




module.exports = router;