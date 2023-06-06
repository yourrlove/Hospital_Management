const Disease = require('../models/diseases_data');
const Dotor_Room = require('../models/doctor_room');
const List_Reception = require('../models/list_patients_reception');

// GET - Recption 
exports.getReception = async (req, res, next) => {
    let [waiting_patients, rooms] = await Promise.all([
        List_Reception.fectAllPatients(),
        Dotor_Room.fetchAllDotorRooms()
    ]);

    //move all patient from waiting queue to correlative dotor's room
    if(req.query.move) {
        [waiting_patients, rooms] = Dotor_Room.movePatients(waiting_patients, rooms);
        List_Reception.inputDataReception(waiting_patients);
        Dotor_Room.inputDoctorRooms(rooms);
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

//  GET - Edit patient infor
exports.getPatient = async (req, res, next) => {
    
    const id = req.params.patientID;
    const edit = (req.query.edit ?? false);
    let patients = await List_Reception.fectAllPatients();
    const patient = patients.find(p => p.id == id);

    res.render('patient/patient', {
        pageTitle: 'Patient Details',
        path: '/patient',
        p: patient,
        edit: edit
    });
};

//  POST - Edit patient infor
exports.postPatient = async (req, res, next) => {
    const {
        id: id,
        name: name,
        birth: birth,
        disease: disease,
        time: time,
        SI: SI
    } = req.body;

    let patients = await List_Reception.fectAllPatients();
    const patientIndex = patients.findIndex(p => p.id == id);
    patients[patientIndex].id = id; 
    patients[patientIndex].name = name;
    patients[patientIndex].birth = birth;
    patients[patientIndex].disease = disease;
    patients[patientIndex].time = time;
    patients[patientIndex].SI = SI;

    List_Reception.inputDataReception(patients);
    
    res.redirect(`patient/${id}?edit=true`);
};



