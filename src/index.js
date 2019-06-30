const express = require('express');
const cors = require('cors');
const path = require('path');
require('./db/mongoose');
const routes = require('./routes/routes');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(routes);

console.log(path.join(__dirname,'/uploads'));

app.use('/assets', express.static(path.join(__dirname,'/assets')));
app.use('/uploads', express.static(path.join(__dirname,'..','/uploads')));

app.listen(port, () => {
    console.log('Running on port ' + port);
});