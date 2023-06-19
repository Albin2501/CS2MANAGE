const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const itemService = require('../service/itemService');
const profileService = require('../service/profileService');
const historyService = require('../service/historyService');

// ------------------------------- INITIALIZATION -------------------------------

app.set('port', 2501);
app.listen(2501);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    next();
});

// ------------------------------- ENDPOINTS -------------------------------

// ------------------------------- ITEM

app.get('/getAllItems', async function (req, res) {
    res.send(await itemService.getAllItems().catch(reason => console.log(reason)));
});

app.post('/postItem', jsonParser, async function (req, res) {
    await itemService.postItem(req.body).catch(reason => console.log(reason))
    res.sendStatus(204);
});

app.delete('/deleteItem', async function (req, res) {
    itemService.deleteItem(req.query.id).catch(reason => console.log(reason));
    res.sendStatus(204);
});

app.delete('/deleteAllItems', async function (req, res) {
    itemService.deleteAllItems().catch(reason => console.log(reason));
    res.sendStatus(204);
});

// ------------------------------- PROFILE

app.get('/getAllItemsOfProfiles', async function (req, res) {
    res.send(await profileService.getAllItemsOfProfiles().catch(reason => console.log(reason)));
});

app.patch('/editProfile', jsonParser, async function (req, res) {
    profileService.editProfile(req.body).catch(reason => console.log(reason));
    res.sendStatus(204);
});

// ------------------------------- HISTORY

app.get('/getHistory', async function (req, res) {
    res.send(historyService.getHistory().catch(reason => console.log(reason)));
});

app.delete('/deleteHistoryEntry', async function (req, res) {
    historyService.deleteHistoryEntry(req.query.id).catch(reason => console.log(reason));
    res.sendStatus(204);
});

app.delete('/deleteHistory', async function (req, res) {
    historyService.deleteHistory().catch(reason => console.log(reason));
    res.sendStatus(204);
});
