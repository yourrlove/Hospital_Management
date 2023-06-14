const path = require('path');
const fs = require('fs');


const p = path.resolve('data', 'user_data', 'lobby_patients.json');


module.exports = class List_Lobby {

    // <--- Priority Queue --->
    /*
        priority high ~ small number
        priority low ~ large number
    */
    static async Enqueue(newPatient) {
        try {
            let listPatients = await this.fectAllPatients(false);    
            listPatients.push(newPatient);
            this.bubleUp(listPatients);
            await this.inputPatientLobby(listPatients);
        } catch(err) {
            console.log(err);
        }
    }

    static bubleUp(listPatients) {
        const childPrior = listPatients[listPatients.length - 1].priority;
        let childIndex = listPatients.length - 1;

        while(childIndex > 0) {
            let parentIndex = Math.floor((childIndex - 1) / 2);
            let parentPrior = listPatients[parentIndex].priority;
            if(parentPrior > childPrior) {
                this.swap(listPatients, childIndex, parentIndex);
            } else {
                break;
            }
            childIndex = parentIndex;
        }
    }

    static async Dequeue() {
        try {
            
            let listPatients = await this.fectAllPatients(false);  
            const len = listPatients.length;
            
            if(len > 0) {
                const patient_move = this.sinkDown(listPatients, len);
                await this.inputPatientLobby(listPatients);
                return patient_move;
            }
    
            return undefined;
        
        } catch(err) {
            console.log(err);
        }
    }

    static sinkDown(listPatients, len) {

        const patient_move = listPatients[0];
        listPatients[0] = listPatients[len - 1];
        listPatients.pop();

        let parentIndex = 0;
        let childIndex = 2 * parentIndex + 1;

        // childIndex less than len - 1 to avoid accessing to rightchild which is out of arr range
        while(childIndex < len - 1) {

            // compare leftchild (child) to rightchild (child + 1)
            if(childIndex < len - 2 && listPatients[childIndex].priority > listPatients[childIndex + 1].priority) {
                childIndex = childIndex + 1;
            }

            // swap if child priority is higher than its parent
            if(listPatients[parentIndex].priority > listPatients[childIndex].priority) {
                this.swap(listPatients, parentIndex, childIndex);
                parentIndex = childIndex;
                childIndex = parentIndex * 2 + 1;
            } else {
                break;
            }
        }

        return patient_move;
    }

    static heapSort(listPatients) {
        let newlist = [];
        let len = listPatients.length;
        while(len > 0) {
            const temp = this.sinkDown(listPatients, len);
            newlist.push(temp);
            len--;
        }
        return newlist;
    }

    static swap(listPatients, index_1, index_2) {
        [listPatients[index_1], listPatients[index_2]] =  [listPatients[index_2], listPatients[index_1]];
    }
    
    // <--- * --->

    static fectAllPatients(flag) {
        return new Promise((resolve, reject) => {
            fs.readFile(p, (err, fileContent) => {
                if(!err && fileContent.length > 0) {
                    let listPatients = JSON.parse(fileContent);
                    if(flag) {
                        listPatients = this.heapSort(listPatients);
                    }
                    resolve(listPatients);
                } else {
                    resolve([]);
                }
            });
        });
    }

    static inputPatientLobby (patients) {
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(patients), err=> {
                if(err) console.log(err);
                resolve();
            });
        });
    }

}
