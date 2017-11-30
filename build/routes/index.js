"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
const Firebase = require("firebase");
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});
router.post('/createOffer', (req, res) => {
    const { name } = req.body;
    if (name) {
        res.json({
            name,
            ok: true,
        });
        return;
    }
    res.json({
        error: 'Missing name field.',
    });
});
router.post('/signIn', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.json({
            ok: false,
            error: 'Missing name field for signin.',
        });
        return;
    }
    const firebaseNamePath = `users/${name}`;
    Firebase.database().ref(firebaseNamePath)
        .once('value')
        .then((snapshot) => {
        const user = snapshot.val();
        if (!user) {
            // User doesn't exist
            Firebase.database().ref(firebaseNamePath).set(true);
        }
        res.json({
            ok: true,
            name,
        });
    })
        .catch((error) => {
        res.json({
            ok: false,
            error: 'Error grabbing user.',
        });
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map