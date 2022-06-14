const mysql = require('mysql');

const processRow=(row,callback)=>{
    console.log(row);
    callback();
}

const condb = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'osd_dpdpa'
});

module.exports = {
    _login: (username,password) => {
        return new Promise((resolve, reject) => {
            condb.query(`SELECT * FROM tb_users WHERE username = '${username}' AND password = '${password}' `, function (err, result, fields) {
                if (err) throw err;
                console.log(result)
                if(result.length>0){
                     resolve('true')
                }else{
                     resolve('false')
                }
            });
        })
        // condb.query(`SELECT * FROM tb_users WHERE username = '${username}' AND password = '${password}' `, function (err, result, fields) {
        //     if (err) throw err;
        //     console.log(result)
        //     if(result.length>0){
        //         return (true)
        //     }else{
        //         return (false)
        //     }
        // });
    },

    
}