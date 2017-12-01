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
router.post('/findMatch', (req, res) => {
    const { name, city } = req.body;
    if (!name || !city) {
        res.json({
            error: 'Missing name or city.',
        });
        return;
    }
    // Search for pending matches
    const fbPendingMatchesPath = `pendingMatches`;
    firebaseApp.database().ref(fbPendingMatchesPath)
        .once('value')
        .then((snapshot) => {
        const pendingMatches = snapshot.val();
        if (!pendingMatches) {
            // No pending matches, put user in pending
            const pendingId = firebaseApp.database().ref(fbPendingMatchesPath).push().key;
            const pendingMatchForUserPath = `pendingMatches/${pendingId}`;
            firebaseApp.database().ref(pendingMatchForUserPath)
                .set({
                username: name,
                city,
            });
            const fbUserPendingIdPath = `users/${name}/pendingId`;
            firebaseApp.database().ref(fbUserPendingIdPath).set(pendingId);
        }
        res.json({
            ok: true,
            name,
        });
    })
        .catch((error) => {
        res.json({
            ok: false,
            error: 'Error finding match.',
        });
    });
});
router.post('/resetMatch', (req, res) => {
    const { username } = req.body;
    if (!username) {
        res.json({
            ok: false,
            error: 'Missing name field for signin.',
        });
        return;
    }
    const fbUserPath = `users/${username}`;
    firebaseApp.database().ref(fbUserPath)
        .once('value', (snapshot) => {
        const user = snapshot.val();
        firebaseApp.database().ref(fbUserPath).set({ username });
        if (user.pendingId) {
            const fbPendingMatchesPath = `pendingMatches/${user.pendingId}`;
            firebaseApp.database().ref(fbPendingMatchesPath).set(null);
        }
    })
        .catch((error) => {
        res.json({
            ok: false,
            error: 'Error reseting user.',
        });
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
    firebaseApp.database().ref(fbNamePath)
        .once('value')
        .then((snapshot) => {
        const user = snapshot.val();
        if (!user) {
            // User doesn't exist create user, set match status
            firebaseApp.database().ref(fbNamePath).set({
                username: name,
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