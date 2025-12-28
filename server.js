const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.send('Welcome to hotel ... How can i help you?')
})


// Import the router files
const personRoutes = require('./routes/personRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');

// Use the routers
app.use('/person', personRoutes)
app.use('/menu', menuItemRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("listening on port: 3000")
})