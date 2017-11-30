var express = require('express');
import { Request, Response } from 'express';
var router = express.Router();
import * as Firebase from 'firebase';

/* GET home page. */
router.get('/', function(req: Request, res: Response) {
  res.render('index', { title: 'Express' });
});

router.post('/createOffer', (req: Request, res: Response) => {
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

router.post('/signIn', (req: Request, res: Response) => {
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
    .then((snapshot: Firebase.database.DataSnapshot) => {
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
    .catch((error: any) => {
      res.json({
        ok: false,
        error: 'Error grabbing user.',
      });
    });
});

module.exports = router;
