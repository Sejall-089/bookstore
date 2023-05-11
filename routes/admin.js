var express = require('express');
var pool = require('./pool');
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
var router = express.Router();

router.get('/loginpage',function(req,res){
    try{
        var admin = localStorage.getItem('ADMIN')
        if(admin){
            res.render('dashboard',{admin:JSON.parse(admin)})
        }
        else{
            res.render('loginpage',{message:''})
        }
    }
    catch(e){
        res.render('loginpage',{message:''})
    }
    
})

router.post('/check_admin_login',function(req,res){
    console.log(req.body)
    pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
        if(error){
            res.render('loginpage',{message:"Server Error...."})
        }
        else{
            if(result.length==0){
                res.render('loginpage',{message:"Invalid EmailId/MobileNo/Password..."})
            }
            else{
                localStorage.setItem('ADMIN',JSON.stringify(result[0]))
                res.render('dashboard',{admin:result[0]})
            }
        }
    })
})

router.get('/logout',function(req,res){
    localStorage.clear()
    res.render('loginpageuser',{message:''})
})

module.exports = router