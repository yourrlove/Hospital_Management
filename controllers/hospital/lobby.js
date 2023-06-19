const List_Lobby = require('../../models/list_patients_lobby');
const List_Reception = require('../../models/list_patients_reception');
const Disease = require('../../models/diseases_data');
const Patient = require('../../models/patient');

exports.getLobby = async (req, res, next) => {
    const [listDieases, patients] = await Promise.all([
        Disease.fectAllDisease(), 
        List_Lobby.fectAllPatients(true)
    ]);    
    const ListDiseaseName = listDieases.map(dis => dis.disease);

    res.render('hospital/lobby',
    {
        pageTitle: 'Lobby',
        path: '/hospital/lobby',
        diseases: ListDiseaseName,
        patients: patients,
        admin: false
    });
};

exports.postLobby = async (req, res, next) => {
    const {
        Name: name,
        Birthday: birth,
        Disease: disease_name,
        Time: time
    } = req.body;

    // add more infor related to disease and create new Patient obj
    const data = await Disease.fectAllDisease();
    const disease_infor = data.find(dis => dis.disease === disease_name);
    disease_infor.name = name;
    disease_infor.birth = birth;
    disease_infor.time = time;
    const newPatient = new Patient(disease_infor);

    await List_Lobby.Enqueue(newPatient);

    res.redirect('/hospital/lobby');
};
