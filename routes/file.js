const express = require('express');
const router = express.Router();
const mysql = require('../config')
const fs = require('fs')
const https = require('https');
const mime = require('mime')

router.post('/upload', function(req, res) {
    let arrUrl = req.body.file.split('/')
    let arrNameFile = arrUrl[arrUrl.length - 1].split('.')

    let file = fs.createWriteStream("files/" + arrUrl[arrUrl.length - 1]);

    https.get(req.body.file, function( response) {
        response.pipe(file);

        fs.stat('files/' + arrUrl[arrUrl.length - 1], function(err, stats) {
            mysql.db.query('INSERT INTO `files` (name,expansion,mimetype,size,date) VALUES ("' + arrNameFile[0] + '","' + arrNameFile[arrNameFile.length - 1] + '","'+ mime.getType(arrUrl[arrUrl.length - 1]) +'","'+ stats["size"] +'", "'+ stats["ctime"] +'")', function (err) {
                if(err) console.log(err)
            });

            return res.send({ message: `Файл успешно загружен` })
        })
    });
})

router.get('/list', function(req, res) {
    mysql.db.query('SELECT * FROM `files`', function (err, rows) {
        let page
        let listSize

        if(!req.query.page){
            page = 1
        } else {
            page = req.query.page
        }

        if(!req.query.list_size){
            listSize = 10
        } else {
            listSize = req.query.list_size
        }

        let startFile = (page * listSize) - listSize
        let endFile = page * listSize

        let arrFiles = rows.map((file, index) => {
            if(index >= startFile && index < endFile){
                return {
                    name: file.name,
                    expansion: file.expansion,
                    mimetype: file.mimetype,
                    size: file.size,
                    date: file.date
                }
            }
        })

        return res.send(arrFiles)
    })
})

router.delete('/delete/:id', function(req, res) {
    mysql.db.query('SELECT * FROM `files` WHERE name ="' + req.params.id + '"', function (err, rows) {
        if(err) return console.log(err)

        if(rows.length === 0) return res.send(`Данного файла не существует`)

        fs.unlink(`files/${rows[0].name}.${rows[0].expansion}`, (err) => {
            if(err) return console.log(err)
        })

        mysql.db.query('DELETE FROM `files` WHERE name ="' + rows[0].name +'"', function (err) {
            if(err) return console.log(err)
        })

        return res.send({ message: `Файл ${rows[0].name}.${rows[0].expansion} успешно удалён` })
    })
})

router.get('/download/:id', function(req, res) {
    mysql.db.query('SELECT * FROM `files` WHERE name ="' + req.params.id + '"', function (err, rows) {
        if(err) return console.log(err)
        if(rows.length === 0) return console.log(`Данного файла не существует`)

        return res.download(`files/${rows[0].name}.${rows[0].expansion}`)
    })
})

router.get('/:id', function(req, res) {
    mysql.db.query('SELECT * FROM `files` WHERE name ="' + req.params.id + '"', function (err, rows) {
        if(err) return console.log(err)
        if(rows.length === 0) return console.log(`Данного файла не существует`)

        return res.send({
            name: rows[0].name,
            expansion: rows[0].expansion,
            mimetype: rows[0].mimetype,
            size: rows[0].size,
            date: rows[0].date
        })
    })
})

module.exports = router;
