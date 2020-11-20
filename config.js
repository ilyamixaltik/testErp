const mysql = require('mysql');

let connectDB = {
    db: null,
    connect: function () {
        console.log(`Устанавливаю подключение к MySql`);

        connectDB.db = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'tests',
            charset: 'utf8_general_ci',
            connectionLimit: 100
        });

        connectDB.db.getConnection (function (err, connection) {
            if(err) {
                return console.error(`Ошибка с подключением к бд`, err);
            } else {
                console.log(`К MySql подключение установлено`);
            }
        });
    }
}

connectDB.connect()

module.exports = connectDB;
