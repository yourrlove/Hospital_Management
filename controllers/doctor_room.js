const Dotor_Room = require('../models/doctor_room');

exports.getDoctorRooms = async (req, res, next) => {

    const move = req.query.move ?? false;
    const room_id = req.params.roomID;

    let all_rooms = await Dotor_Room.fetchAllDotorRooms();
    const access_room_idx = all_rooms.findIndex(room => room.id == room_id);
    let access_room_patients = all_rooms[access_room_idx].patients;

    if(move) {
        access_room_patients = Dotor_Room.donePatient(access_room_idx, all_rooms);
    }

    res.render('admin/doctor_room', {
        pageTitle: "Doctor's Room",
        path: '/admin/doctor_room',
        room: all_rooms[access_room_idx],
        patients: access_room_patients,
        max_slot: all_rooms[access_room_idx].max_slot - 1,
        start_idx: 1,
        edit: false
    });
};