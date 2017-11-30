"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
const Firebase = require("firebase");
// Initialize Firebase
const firebaseApp = Firebase.initializeApp({
    apiKey: "AIzaSyALQA_6xmnfKO9GWq-46arvBOwtVDY0fpg",
    authDomain: "travelbuddy-e1b62.firebaseapp.com",
    databaseURL: "https://travelbuddy-e1b62.firebaseio.com",
    projectId: "travelbuddy-e1b62",
    storageBucket: "travelbuddy-e1b62.appspot.com",
    messagingSenderId: "682121885147"
});
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
    const fbNamePath = `users/${name}`;
    const fbMatchStatusPath = `matchStatus/${name}`;
    firebaseApp.database().ref(fbNamePath)
        .once('value')
        .then((snapshot) => {
        const user = snapshot.val();
        if (!user) {
            // User doesn't exist create user, set match status
            firebaseApp.database().ref(fbNamePath).set(true);
            firebaseApp.database().ref(fbMatchStatusPath).set({
                username: name,
                isMatched: false,
            });
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