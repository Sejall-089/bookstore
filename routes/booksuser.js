var express = require('express');
var pool = require('./pool');
var multer = require('./multer');
var router = express.Router();

router.get('/fetch_all_bookdetails_for_user',function(req,res){
    try{
        var user = localStorage.getItem('USER')
        if(!user){
            res.render('loginpageuser',{message:''})
        }
    }
    catch(e){
        res.render('loginpageuser',{message:''})
    }
    pool.query("select BD.*, (select S.subjectname from subjects as S where S.subjectid=BD.subjectid) as subjectname, (select BT.titlename from booktitle as BT where BT.titleid=BD.titleid) as title from bookdetails as BD",function(error,result){
        if(error){
            res.render('displayallbooksuser',{data:[], message:''})
        }
        else{
            console.log(result)
            res.render('displayallbooksuser',{data:result, message:''})
        }
    })
})

module.exports = router;