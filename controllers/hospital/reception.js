const Disease = require('../../models/diseases_data');
const Dotor_Room = require('../../models/doctor_room');
const List_Reception = require('../../models/list_patients_reception');

// GET - Recption 
exports.getReception = async (req, res, next) => {
    let [waiting_patients, rooms] = await Promise.all([
        List_Reception.fectAllPatients(),
        Dotor_Room.fetchAllDotorRooms()
    ]);

    res.render('hospital/reception', {
        pageTitle: 'Reception',
        path: '/hospital/reception',
        patients: waiting_patients,
        doctor_rooms: rooms,
        max_slot: 10,
        start_idx: 0,
        edit: false,
        admin: false
    });
};
