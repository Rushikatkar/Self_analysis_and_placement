var mysql=require('mysql');
var express=require('express');
var bodyParser=require('body-parser');
var session=require('express-session');
var bcrypt= require('bcrypt');

var app=express();
var con=require('./connection');
const { application, request, response } = require('express');
app.set('view engine','ejs');
app.use(session({
    secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
//posting database html file to the browser 
app.get('/html/database_input',function(req,res){
    res.sendFile(__dirname+"/html/database_input.html");
});
app.get('/html/database_input',function(req,res){
    if(req.session.loggedin){
        res.sendFile(__dirname+'/html/database_input.html');
    }else{
        res.send('You must login to view this page <br><A href="/login">Click here to Login</a>')
    }
        
});
//posting all data that entered into the html file to the database.
app.post('/html/database_input',function(req,res){
    var Companyname= req.body.cname;
    var marks= req.body.marks;
    var cgpa= req.body.cgpa;
    var backlog= req.body.backlog;
    
    console.log(Companyname,marks,cgpa,backlog);

    con.connect(function(error){
        if(error) throw error;

        var sql = "INSERT INTO company_data(company_name,marks,cgpa,backlogs)VALUES('"+Companyname+"','"+marks+"','"+cgpa+"','"+backlog+"')";
        con.query(sql,function(error,result){
            if(error) throw error;
            res.send("Submitted!")
        });
    })
});


//posting signup html file to the browser
// app.get('/signup',function(req,res){
//     res.sendFile(__dirname+'/html/signup.html');
// });
// posting Data from form to the database of Registration Page.
// app.post('/signup',async function(req,res){
//     var name=req.body.name;
//     var email=req.body.email;
//     var password=req.body.password;
//     // password= await bcrypt.hash(password,10);
//      //const isvalid= await bcypt.compare(password,hashed password);
    
    
//         con.connect(function(error){
//             if(error) throw error;
//             con.query("SELECT COUNT(*) AS count FROM registration_data WHERE email = ?" , [email] , function(error , results){
//                 if(error){
//                     console.log(err);
//                  }else{
//                        if(results[0].count > 0){  
//                          res.send("This email is already in use, try with another email.");  
//                        }else{
//                         var sql="INSERT INTO registration_data(name,email,password)VALUES('"+name+"','"+email+"','"+password+"')";
//                         con.query(sql,function(error){
                
//                             if(error) throw error;
//                             res.send("Register Sucessfully");
                            
//                         });
//                        }
//                     }
//             });
            
//         });



//         //original code
//         // var sql="INSERT INTO registration_data(name,email,password)VALUES('"+name+"','"+email+"','"+password+"')";
//         // con.query(sql,function(error){

//         //     if(error) throw error;
//         //     res.send("Register Sucessfully");
            
//         // });
    
// });

app.get('/login',function(req,res){
    res.sendFile(__dirname+"/html/login.html");
});
app.post('/login',function(req,res){
    let email=req.body.email;
    let password=req.body.password;
   // console.log(email,password);
//    con.query('SELECT password FROM registration_data WHERE email = ?',[email], async function(results){
//     var hash= results;
//     const isvalid= await bcrypt.compare(password,results);
//     if(!isvalid){
//         res.send('wrong password');
//     }else{
//         password= results;
//     }

//    })
    if(email && password){
        con.query('SELECT * FROM registration_data WHERE email = ? AND password = ?',[email,password],function(error,results,fields){

            if(error) throw error;

            if(results.length>0){
                req.session.loggedin=true;
                req.session.email=email;

                //res.sendFile(__dirname+'/database_input.html');
                res.redirect('/sprofileview');
            }else {
                res.send('Incorrect email and/or password');
            }
         

        });
    }else{
        res.send('Please enter email and password');
      
    }
});



app.get('/sprofileview',function(req,res){
 
   
    var sql= "SELECT * FROM mprofile where email= ?; SELECT company_name, company_link FROM company_data;";
    con.query(sql,[req.session.email],function(error,result){
        if(error) throw error;
         res.render(__dirname+"/ejs/demo.ejs",{joined:result});
        
    });
    // var sql= "SELECT * FROM mprofile ; SELECT company_name, company_link FROM company_data;";
    // con.query(sql,function(error,result){
    //     if(error) throw error;
    //      res.render(__dirname+"/ejs/demo.ejs",{joined:result});

    // });

});


app.post('/sap',function(req,res){
    var marks=req.body.marks;
    var cgpa=req.body.cgpa;
    var cgpa_of_diploma=req.body.cgpa_of_diploma;
    var backlogs=req.body.backlogs;
  // var link=req.body.clink;

   con.connect(function(error){
       if(error) console.log(error);

       if(marks>=70 && cgpa>=6 && backlogs<=0 && cgpa_of_diploma>=6){
        var sql="SELECT * FROM cdata.company_data WHERE marks>=70 AND cgpa>=6 AND backlogs<=0";
        //var sql="SELECT company_name FROM cdata.company_data WHERE marks>=60 AND cgpa>=6 AND backlogs<=0";
      con.query(sql,function(error,result){
          if(error) console.log(error);

          res.render(__dirname+"/ejs/company.ejs",{company:result});
      });
  }
  else  if(marks>=70 && cgpa>=6 && backlogs<=1 && cgpa_of_diploma>=6){
    var sql="SELECT * FROM cdata.company_data WHERE marks>=60 AND cgpa>=6 AND backlogs<=1";
    //var sql="SELECT company_name FROM cdata.company_data WHERE marks>=60 AND cgpa>=6 and backlogs<=1";
  con.query(sql,function(error,result){
      if(error) console.log(error);

      res.render(__dirname+"/ejs/company.ejs",{company:result});
  });
}
else   if(marks>=60 && cgpa>=6 && backlogs<=0 && cgpa_of_diploma>=6){
         var sql="SELECT * FROM cdata.company_data WHERE marks>=60 AND cgpa>=6 AND backlogs<=1";
         //var sql="SELECT company_name FROM cdata.company_data WHERE marks>=60 AND cgpa>=6";
       con.query(sql,function(error,result){
           if(error) console.log(error);

           res.render(__dirname+"/ejs/company.ejs",{company:result});
       });
   }
   else  if((marks<=60 && marks>40) && (cgpa<=6 || cgpa>6) && backlogs<=2 && cgpa_of_diploma>=5){
       var sql="SELECT * FROM cdata.company_data WHERE marks<60 AND cgpa<6 AND backlogs<=2";
       //var sql="SELECT company_name FROM cdata.company_data  ";
     con.query(sql,function(error,result){
         if(error) console.log(error);

         res.render(__dirname+"/ejs/company.ejs",{company:result});
     });
   }else if(marks<=40 ||  cgpa<=5 || backlogs>=3 || cgpa_of_diploma<=4){
       res.send("You are not fit to any company criteria");
   }
   });

});

app.get('/sap',function(req,res){
    res.sendFile(__dirname+"/html/sap.html");
});



app.get('/demo',function(req,res){
    res.sendFile( __dirname+"/html/demo.html");
});


// searching companies on page..
app.get('/searching',function(req,res){

    con.connect(function(error){
        if(error) console.log(error);

       var sql= "SELECT * FROM cdata.company_data";
       
        con.query(sql,function(error,result){
            if(error) console.log(error);
            res.render(__dirname+"/ejs/searching.ejs",{students:result});
        });
    });
});
app.get("/searching-company",function(req,res){
    var company_name=req.query.company_name;

    con.connect(function(error){
        if (error) console.log(error);

        var sql= "SELECT * FROM cdata.company_data WHERE company_name LIKE '%"+company_name+"%'";

        con.query(sql,function(error,result){
            if(error) console.log(error);
            
            res.send(result);
        });
    });
});

//getting user information from database and print to the user's profile
// app.post('/registers',function(req,res){
//      var name= req.query.name;

//      var sql="SELECT name FROM cdata.registration_data";
// });

app.get('/Profile',function(req,res){
    res.sendFile(__dirname+"/html/make_profile.html");
});

app.post('/profile',function(req,res){
 var name=req.body.name;
 var email=req.body.email;
 var password=req.body.password;
 var marks=req.body.marks;
 var cgpa=req.body.cgpa;
 var backlogs=req.body.backlogs;
 var domain=req.body.domain;

    
        con.query("SELECT COUNT(*) AS cnt FROM mprofile WHERE email = ?" , [email] , function(error , results){
            if(error){
                console.log(err);
             }else{
                   if(results[0].cnt > 0){  
                     res.send("This email is already in use, try with another email.");  
                   }else{
                    var sql="INSERT INTO cdata.mprofile(name,email,password,marks,cgpa,backlogs,domain)VALUES('"+name+"','"+email+"','"+password+"','"+marks+"','"+cgpa+"','"+backlogs+"','"+domain+"')";
                    con.query(sql,function(error){
                    
                        if(error) throw error;
                       
                        res.send("create profile Sucessfully");
                        
                    });
                   }
                }
        });
        
   

});

// get requests for the comapnies full informations.
app.get('/company_information/google.html',function(req,res){
    res.sendFile(__dirname+"/company_information/google.html");
});
app.get('/company_information/accenture.html',function(req,res){
    res.sendFile(__dirname+"/company_information/accenture.html");
});
app.get('/company_information/microsoft.html',function(req,res){
    res.sendFile(__dirname+"/company_information/microsoft.html");
});
app.get('/company_information/infosys.html',function(req,res){
    res.sendFile(__dirname+"/company_information/infosys.html");
});

app.listen(3000,function(){
    console.log("Connected...");
});
