var express = require('express');
var pool = require('./pool');
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
var router = express.Router();

router.get('/loginpage',function(req,res){
    try{
        var user = localStorage.getItem('USER')
        if(user){
            res.render('dashboarduser',{user:JSON.parse(user)})
        }
        else{
            res.render('loginpageuser',{message:''})
        }
    }
    catch(e){
        res.render('loginpageuser',{message:''})
    }
    
})

router.post('/check_user_login',function(req,res){
    console.log(req.body)
    pool.query("select * from users where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
        if(error){
            res.render('loginpageuser',{message:"Server Error...."})
        }
        else{
            if(result.length==0){
                res.render('loginpageuser',{message:"Invalid EmailId/MobileNo/Password..."})
            }
            else{
                localStorage.setItem('USER',JSON.stringify(result[0]))
                res.render('dashboarduser',{user:result[0]})
            }
        }
    })
})

router.get('/logout',function(req,res){
    localStorage.clear()
    res.render('loginpageuser',{message:''})
})

module.exports = router