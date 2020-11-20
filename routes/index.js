const express = require('express');
const router = express.Router();
const mysql = require('../config')

router.get('/', function(req, res) {
    mysql.db.query('SELECT * FROM `users` WHERE access_token ="'+ req.body.access_token +'"', function(err, rows, fields){
        return res.send(`Ваш id: ${rows[0].id}`)
    })
})

module.exports = router;
