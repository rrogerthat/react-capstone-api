"use strict";

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));	
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/api/*', (req, res) => {
	res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};