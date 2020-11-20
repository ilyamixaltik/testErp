const express = require('express');
const router = express.Router();
const mysql = require('../config');
const jwt = require('jsonwebtoken');

router.post('/', function(req, res) {
    mysql.db.query('SELECT * FROM `users` WHERE id ="' + req.body.id + '" AND password ="'+ req.body.password +'"', function (err, rows, fields) {
        if(rows.length === 0) return res.send(`Не верный логин или пароль`)

        return res.send(rows[0].access_token)
    })
});

router.post('/new_token/', function(req, res){
    mysql.db.query('SELECT * FROM `users` WHERE access_token ="' + req.body.access_token + '"', function (err, rows, fields) {
        if(rows.length === 0) return res.send(`Invalid token`)

        let access_token = jwt.sign({
            id: req.body.id,
            password: req.body.password
        }, 'secretOne', { expiresIn: '10m' })

        mysql.db.query('UPDATE `users` SET access_token ="' + access_token + '"', function (err) {
            if(err) console.log(err)
        })

        return res.send(`Токен успешно обновлён`)
    })
});

module.exports = router;
