module.exports = class Patient {
    constructor({name, birth, date, time, disease, priority, specialist}) {
        this.id = Math.trunc(Math.random()*10000000000);
        this.name = name;
        this.birth = birth;
        this.time = time;
        this.disease = disease;
        this.priority = priority;
        this.specialist = specialist;
    }
}



