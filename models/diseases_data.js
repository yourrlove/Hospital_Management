const path = require('path');
const fs = require('fs');

const p = path.resolve('data', 'hospital_data', 'diseases.json');

module.exports = class Disease {
    static fectAllDisease() {
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
};