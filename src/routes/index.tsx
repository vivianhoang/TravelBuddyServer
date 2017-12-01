var express = require('express');
import { Request, Response } from 'express';
var router = express.Router();
import * as Firebase from 'firebase';
import * as models from '../models';

// Initialize Firebase
const firebaseApp: Firebase.app.App = Firebase.initializeApp({
  apiKey: "AIzaSyALQA_6xmnfKO9GWq-46arvBOwtVDY0fpg",
  authDomain: "travelbuddy-e1b62.firebaseapp.com",
  databaseURL: "https://travelbuddy-e1b62.firebaseio.com",
  projectId: "travelbuddy-e1b62",
  storageBucket: "travelbuddy-e1b62.appspot.com",
  messagingSenderId: "682121885147"
});

/* GET home page. */
router.get('/', function(req: Request, res: Response) {
  res.render('index', { title: 'Express' });
});

router.post('/findMatch', (req: Request, res: Response) => {
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
    .then((snapshot: Firebase.database.DataSnapshot) => {
      const pendingMatches: models.PendingMatches = snapshot.val();
      if (!pendingMatches) {
        // No pending matches, put user in pending
        const pendingId = firebaseApp.database().ref(fbPendingMatchesPath).push().key;
        const pendingMatchForUserPath = `pendingMatches/${pendingId}`;
        firebaseApp.database().ref(pendingMatchForUserPath)
          .set({
            username: name,
            city,
          });
      }
      res.json({
        ok: true,
        name,
      });
    })
    .catch((error: any) => {
      res.json({
        ok: false,
        error: 'Error finding match.',
      });
    });
});

router.post('/signIn', (req: Request, res: Response) => {
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
    .then((snapshot: Firebase.database.DataSnapshot) => {
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
    .catch((error: any) => {
      res.json({
        ok: false,
        error: 'Error grabbing user.',
      });
    });
});

module.exports = router;
