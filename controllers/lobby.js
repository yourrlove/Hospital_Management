const List_Lobby = require('../models/list_patients_lobby');
const List_Reception = require('../models/list_patients_reception');
const Disease = require('../models/diseases_data');
const Patient = require('../models/patient');

exports.getLobby = async (req, res, next) => {

    let [ListLobbyPatients, ListReceptionPatients] = await Promise.all([ 
        List_Lobby.fectAllPatients(),
        List_Reception.fectAllPatientsReception()
    ]);

    if(req.query.move) {
        let flag = 1;
        const len_reception = ListReceptionPatients.length;
        const len_lobby = ListLobbyPatients.length;
        if(len_reception >= 10 || len_lobby == 0) {
            flag = 0;
        } else {
            const move_patient = await List_Lobby.Dequeue();
            ListReceptionPatients.push(move_patient);
            await List_Reception.inputDataReception(ListReceptionPatients);
        }
        res.redirect(`/admin/lobby?success=${flag}`);

    } else {
        let flag = null;
        if(req.query.success !== null && req.query.success !== undefined) {
            flag = req.query.success;
        }
        const [listDieases, patients] = await Promise.all([
                Disease.fectAllDisease(), 
                List_Lobby.fectAllPatients()
            ]);
        const ListDiseaseName = listDieases.map(dis => dis.disease);
        res.render('admin/lobby',
        {
            pageTitle: 'Lobby',
            path: '/admin/lobby',
            diseases: ListDiseaseName,
            patients: patients,
            success: flag
        });
    }
};

exports.postLobby = async (req, res, next) => {
    const {
        Name: name,
        Birthday: birth,
        Disease: disease_name,
        Time: time
    } = req.body;
    const data = await Disease.fectAllDisease();
    const disease_infor = data.find(dis => dis.disease === disease_name);
    disease_infor.name = name;
    disease_infor.birth = birth;
    disease_infor.time = time;
    const newPatient = new Patient(disease_infor);
    await List_Lobby.Enqueue(newPatient);
    res.redirect('/admin/lobby');
};

