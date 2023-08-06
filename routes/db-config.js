const mysql = require('mysql')

const db  = mysql.createConnection({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'teamb006',
    password        : 'c0gjyXj0ZS',
    database        : 'teamb006'
}

module.exports = db;