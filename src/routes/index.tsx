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

  const fbPendingMatchesPath = `pendingMatches`;
  const fbConnectionMatchesPath = `connections`;

  function setToPendingMatch() {
    // No pending matches, put user in pending
    const pendingId = firebaseApp.database().ref(fbPendingMatchesPath).push().key;
    const pendingMatchForUserPath = `pendingMatches/${pendingId}`;
    firebaseApp.database().ref(pendingMatchForUserPath)
      .set({
        pendingId,
        username: name,
        city,
      });
    const fbUserPendingIdPath = `users/${name}/pendingId`;
    firebaseApp.database().ref(fbUserPendingIdPath).set(pendingId);
  }

  function setToConnectionMatch(matchedUsername: string) {
    const connectionId = firebaseApp.database().ref(fbConnectionMatchesPath).push().key;
    const fbConnectionsByIdPath = `connections/${connectionId}`;
    firebaseApp.database().ref(fbConnectionsByIdPath)
      .set({
        connectionId,
        members: {
          [name]: true,
          [matchedUsername]: true,
        },
        city,
      });
    const fbUserConnectionIdPath = `users/${name}/connectionId`;
    firebaseApp.database().ref(fbUserConnectionIdPath).set(connectionId);
    const fbMatchedUserPath = `users/${matchedUsername}`;
    firebaseApp.database().ref(fbMatchedUserPath).once('value', (snapshot: Firebase.database.DataSnapshot) => {
      const user = snapshot.val();
      if (user.pendingId) {
        const fbMatchedUserPendingMatchPath = `pendingMatches/${user.pendingId}`;
        firebaseApp.database().ref(fbMatchedUserPendingMatchPath).set(null);
      }
      firebaseApp.database().ref(fbMatchedUserPath).set({
        connectionId,
        username: matchedUsername,
      });
    });
  }
  
  // Search for pending matches
  firebaseApp.database().ref(fbPendingMatchesPath)
    .once('value')
    .then((snapshot: Firebase.database.DataSnapshot) => {
      const pendingMatches: models.PendingMatches = snapshot.val();
      if (!pendingMatches) {
        setToPendingMatch();
      } else {
        // Look for match
        let matchedUsername = '';
        Object.keys(pendingMatches).forEach((pendingId: string, index: number) => {
          const pendingMatch: models.PendingMatch = pendingMatches[pendingId];
          const pendingCity = pendingMatch.city;
          const pendingUsername = pendingMatch.username;
          if (city === pendingCity) {
            matchedUsername = pendingUsername;
          }
        });
        if (!matchedUsername) {
          setToPendingMatch();
        } else {
          // Got a match!
          setToConnectionMatch(matchedUsername);
        }
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

router.post('/resetMatch', (req: Request, res: Response) => {
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
    .once('value', (snapshot: Firebase.database.DataSnapshot) => {
      const user = snapshot.val();
      firebaseApp.database().ref(fbUserPath).set({username});
      if (user.pendingId) {
        const fbPendingMatchesPath = `pendingMatches/${user.pendingId}`;
        firebaseApp.database().ref(fbPendingMatchesPath).set(null);
      }
      res.json({
        ok: true,
      });
    })
    .catch((error: any) => {
      res.json({
        ok: false,
        error: 'Error reseting user.',
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
