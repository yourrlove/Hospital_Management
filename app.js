const express= require('express');

const adminRouters = require('./routes/admin_routes');
const hospitalRoutes = require('./routes/hospital_routes'); 
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/admin', adminRouters);
app.use('/hospital', hospitalRoutes);
app.use(errorController.get404);

app.listen(8000);

