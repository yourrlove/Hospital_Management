const path = require('path');
const fs = require('fs');


const p = path.resolve('data', 'user_data', 'lobby_patients.json');


module.exports = class List_Lobby {

    // <--- Priority Queue --->
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
                const temp = listPatients[childIndex];
                listPatients[childIndex] = listPatients[parentIndex];
                listPatients[parentIndex] = temp;
            } else {
                break;
            }
            childIndex = parentIndex;
        }
    }

    static async Dequeue(cb) {
        try {
            let listPatients = await this.fectAllPatients(false);  
            
            const patient_move = listPatients[0];
            const len = listPatients.length;
            if(len > 0) {
                listPatients[0] =listPatients[len - 1];
                listPatients.pop();
                this.sinkDown(listPatients);
            }
            await this.inputPatientLobby(listPatients);
            return patient_move;
        } catch(err) {
            console.log(err);
        }
    }

    static sinkDown(listPatients) {
        let i = 0;
        let len = listPatients.length;

        while(i < len) {

            let curPrior = listPatients[i].priority;
            let leftChild = 2 * i + 1;
            let rightChild = 2 * i + 2;
            let indexSwap = null;

            if(leftChild < len && curPrior > listPatients[leftChild].priority) {
                curPrior = listPatients[leftChild].priority;
                indexSwap = leftChild;
            }

            if(rightChild < len && curPrior > listPatients[rightChild].priority) {
                indexSwap = rightChild;
            }

            if(indexSwap !== null) {
                const temp = listPatients[i];
                listPatients[i] = listPatients[indexSwap];
                listPatients[indexSwap] = temp;
            }
            i++;
        }
    }

    static heapSort(listPatients) {
        let newlist = [];
        const len = listPatients.length;
        for(let i = 0; i < len; i++) {
            const temp = listPatients[0];
            listPatients[0] = listPatients.pop();
            this.sinkDown(listPatients);
            newlist.push(temp);
        }
        return newlist;
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
