const express= require('express');

const hospitalRouters = require('./routes/hospital_routes');
const patientRoutes = require('./routes/patient_routes'); 
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/admin', hospitalRouters);
app.use(patientRoutes);
app.use(errorController.get404);

app.listen(8000);

