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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    next();
});

// ------------------------------- ENDPOINTS -------------------------------

// ------------------------------- ITEM
const itemBase = '/item';

app.get(itemBase + '/get', async function (req, res) {
    res.send(await itemService.getAllItems(req.query));
});

app.get(itemBase + '/getOverview', async function (req, res) {
    res.send(itemService.getAllOverviewItems(req.query));
});

app.post(itemBase + '/post', jsonParser, async function (req, res) {
    try {
        await itemService.postItem(req.body);
        res.sendStatus(204);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.patch(itemBase + '/edit', jsonParser, async function (req, res) {
    try {
        itemService.edit(req.body);
        res.sendStatus(204);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

app.delete(itemBase + '/delete', async function (req, res) {
    try {
        itemService.deleteItem(req.query.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

app.delete(itemBase + '/deleteAll', async function (req, res) {
    itemService.deleteAllItems();
    res.sendStatus(204);
});

// ------------------------------- PROFILE
const profileBase = '/profile';

app.get(profileBase + '/get', async function (req, res) {
    res.send(await profileService.getAllProfiles());
});

app.get(profileBase + '/getItems', async function (req, res) {
    res.send(await profileService.getAllItemsOfProfiles().catch(reason => console.log(reason)));
});

app.patch(profileBase + '/edit', jsonParser, async function (req, res) {
    try {
        profileService.editProfile(req.body);
        res.sendStatus(204);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// ------------------------------- HISTORY
const historyBase = '/history';

app.get(historyBase + '/get', async function (req, res) {
    res.send(historyService.getHistory());
});

app.delete(historyBase + '/delete', async function (req, res) {
    try {
        historyService.deleteHistoryEntry(req.query.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

app.delete(historyBase + '/deleteAll', async function (req, res) {
    historyService.deleteHistory();
    res.sendStatus(204);
});
