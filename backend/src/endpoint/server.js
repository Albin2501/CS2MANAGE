const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const itemService = require('../service/itemService');

// ------------------------------- INITIALIZATION -------------------------------

app.set('port', 2501);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    next();
});

// ------------------------------- ENDPOINTS -------------------------------

app.get('/getAllItems', async function (req, res) {
    res.send(await itemService.getAllItems());
});

app.post('/postItem', jsonParser, async function (req, res) {
    await itemService.postItem(req.body)
    res.sendStatus(204);
});

app.delete('/deleteItem', jsonParser, async function (req, res) {
    itemService.deleteItem(req.query.id);
    res.sendStatus(204);
});

app.delete('/deleteAllItems', jsonParser, async function (req, res) {
    itemService.deleteAllItems();
    res.sendStatus(204);
});

app.listen(2501);