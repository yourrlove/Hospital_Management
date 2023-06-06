const path = require('path');
const fs = require('fs');

const p = path.resolve('data', 'hospital_data', 'doctor_rooms.json');

module.exports = class Dotor_room {
    
    static fetchAllDotorRooms () {
        return new Promise((resolve, reject) => {
            fs.readFile(p, (err, fileContent) => {
                if(!err && fileContent.length > 0) {
                    resolve(JSON.parse(fileContent));
                } else {
                    resolve([]);
                }
            });
        });
    }

    //move patient out of room after medical examination is done
    static donePatient (room_idx, all_rooms) {
        let new_patients = all_rooms[room_idx].patients;
        all_rooms[room_idx].cur_slot = (new_patients.shift())? all_rooms[room_idx].cur_slot - 1 : 0; 
        all_rooms[room_idx].patients = [...new_patients];
        this.inputData(all_rooms);
        return new_patients;
    }

    //move all patient from waiting queue to correlative dotor's room
    static movePatients (waiting_patients, rooms) {
        rooms.forEach(room => {
            let len = waiting_patients.length;
            for(let i = 0; i < len;) {
                if(waiting_patients[i].specialist === room.specialist && room.cur_slot < room.max_slot) {
                    room.cur_slot++;
                    room.patients.push(...waiting_patients.splice(i, 1));
                    len--;
                } else {
                    i++;
                }
            }
        });
        return [waiting_patients, rooms];
    }

    static inputDoctorRooms (doctor_rooms) {
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(doctor_rooms), err=> {
                if(err) console.log(err);
                resolve();
            });
        })
    }
};