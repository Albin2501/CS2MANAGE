const express = require('express');
const app = express();

app.set('port', 2501);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    next();
});

app.get('/test', async function (req, res) {
    res.send([2501]);
});

app.listen(2501);