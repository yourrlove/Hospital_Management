const List_Lobby = require('../../models/list_patients_lobby');
const List_Reception = require('../../models/list_patients_reception');
const Disease = require('../../models/diseases_data');
const Patient = require('../../models/patient');

exports.getEditLobby = async (req, res, next) => {

    // Move each patient from Lobby to Reception  
    if(req.query.move) {
        
        let [ListLobbyPatients, ListReceptionPatients] = await Promise.all([ 
            List_Lobby.fectAllPatients(false),
            List_Reception.fectAllPatients()
        ]);

        let flag = 1;
        const len_reception = ListReceptionPatients.length;
        const len_lobby = ListLobbyPatients.length;

        //check if reception is FULL or Lobby is EMPTY - using flag
        if(len_reception >= 10 || len_lobby == 0) {
            flag = 0;
        } 
        else {
            const move_patient = await List_Lobby.Dequeue();
            ListReceptionPatients.push(move_patient);
            await List_Reception.inputDataReception(ListReceptionPatients);
        }
        res.redirect(`/admin/edit_lobby?success=${flag}`);

    } 
    else {
        // flag to indicate whether transfer is successful or failed
        let flag = null ?? req.query.success;
        const patients = await List_Lobby.fectAllPatients(false); 
        res.render('admin/edit_lobby',
        {
            pageTitle: 'Edit Lobby',
            path: '/admin/edit_lobby',
            patients: patients,
            success: flag,
            admin: true
        });
    }
};

