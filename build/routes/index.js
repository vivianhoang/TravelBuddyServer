"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
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
    if (name) {
        res.json({
            name,
            ok: true,
        });
        return;
    }
    res.json({
        error: 'Missing name field for signin.',
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map