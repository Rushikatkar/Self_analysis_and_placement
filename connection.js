var mysql= require('mysql');

var con=mysql.createConnection({
    multipleStatements: true,
    host:'localhost',
    user:'root',
    password:'password',
    database:'cdata'
});

// con.connect((err) => {
//     if(err){
//         console.log("Failed!");
//     }else{
//         console.log("Connected");
//     }
// });

module.exports=con;