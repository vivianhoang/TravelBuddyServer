var express = require('express');
import { Request, Response } from 'express';
var router = express.Router();

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

module.exports = router;
