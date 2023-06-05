const path = require('path');
const fs = require('fs');

const reception_path = path.resolve('data', 'user_data', 'reception_patients.json');

module.exports = class List_Reception {

    static fectAllPatientsReception () {
        return new Promise((resolve, reject) => {
            fs.readFile(reception_path, (err, fileContent) => {
                if(!err && fileContent.length > 0) {
                    resolve(JSON.parse(fileContent));
                } else {
                    resolve([]);
                }
            });
        });
    }

    static inputDataReception (patients) {
        return new Promise((resolve, reject) => {
            fs.writeFile(reception_path, JSON.stringify(patients), err=> {
                if(err) console.log(err);
                resolve();
            });
        });
    }
};