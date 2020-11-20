const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mysql = require('../config')

router.post('/', function(req, res) {
    mysql.db.query('SELECT * FROM `users` WHERE id ="' + req.body.id + '"', function (err, rows, fields) {

        if (rows.length > 0) return res.send(`Данный логин уже занят`)
        if (err) return console.log(err)

        let access_token = jwt.sign({
            id: req.body.id,
            password: req.body.password
        }, 'secretOne', { expiresIn: '10m' })

        let refresh_token = jwt.sign({
            id: req.body.id,
            password: req.body.password
        }, 'secretTwo')

        mysql.db.query('INSERT INTO `users` (id,password,access_token,refresh_token) VALUES ("' + req.body.id + '","' + req.body.password + '","'+ access_token +'","'+ refresh_token +'")', function (err) {
            if(err) console.log(err)
        });

        return res.send({
            message: `Регистрация прошла успешно`,
            access_token: access_token,
            refresh_token: refresh_token
        })
    })
});

module.exports = router;
