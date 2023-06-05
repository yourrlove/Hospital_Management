const Dotor_Room = require('../models/doctor_room');
const List_Reception = require('../models/list_patients_reception');

exports.getReception = async (req, res, next) => {
    let [waiting_patients, rooms] = await Promise.all([
        List_Reception.fectAllPatientsReception(),
        Dotor_Room.fetchAllDotorRooms()
    ]);

    if(req.query.move) {
        [waiting_patients, rooms] = Dotor_Room.movePatients(waiting_patients, rooms);
        List_Reception.inputDataReception(waiting_patients);
        Dotor_Room.inputData(rooms);
    }
    res.render('admin/reception', {
        pageTitle: 'Reception',
        path: '/admin/reception',
        patients: waiting_patients,
        doctor_rooms: rooms,
        max_slot: 10,
        start_idx: 0,
        edit: true 
    });
};

exports.getPatient = async (req, res, next) => {
    const id = req.params.patientID;
    const edit = (req.query.edit ?? false);
    let patients = await List_Reception.fectAllPatientsReception();
    const patient = patients.find(p => p.id == id);
    res.render('patient/patient', {
        pageTitle: 'Patient Details',
        path: '/patient',
        p: patient,
        edit: edit
    });
};

exports.postPatient = async (req, res, next) => {
    const updatePatient = req.body;
    let patients = await List_Reception.fectAllPatientsReception();
    
    const patientIndex = patients.findIndex(p => p.id == updatePatient.id);
    patients[patientIndex] = updatePatient;
    List_Reception.inputDataReception(patients);
    
    res.redirect(`patient/${updatePatient.id}?edit=true`);
};



