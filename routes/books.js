var express = require('express');
var pool = require('./pool');
var multer = require('./multer');
var router = express.Router();

router.get('/bookinterface',function(req,res){
    try{
        var admin = localStorage.getItem('ADMIN')
        if(admin){
            res.render('bookinterface',{status:-1, message:""})
        }
        else{
            res.render('loginpage',{message:''})
        }
    
    }
    catch(e){
        res.render('loginpage',{message:''})
    }
    
})

router.get('/fetch_all_subjects',function(req,res){
    pool.query("select * from subjects",function(error,result){
        if(error){
            res.status(500).json([])
        }
        else{
            res.status(200).json(result)
        }
    })
})

router.get('/fetch_all_titles',function(req,res){
    pool.query("select * from booktitle where subjectid=?",[req.query.subjectid],function(error,result){
        if(error){
            res.status(500).json([])
        }
        else{
            res.status(200).json(result)
        }
    })
})

router.post('/submit_book_details',multer.single('poster'),function(req,res){
    console.log("BODY: ",req.body)
    console.log("FILE: ",req.file)

    pool.query("insert into bookdetails (subjectid,titleid,author,publisher,price,offer,status,poster) values(?,?,?,?,?,?,?,?)",[req.body.subjectid, req.body.titleid, req.body.author, req.body.publisher, req.body.price, req.body.offer, req.body.status, req.file.originalname],function(error,result){
        if(error){
            console.log(error)
            res.render('bookinterface',{status:0, message:"Server Error..."})
        }
        else{
            res.render('bookinterface',{status:1, message:"Record Submitted Successfully..."})
        }
    })
})

router.get('/fetch_all_bookdetails',function(req,res){
    try{
        var admin = localStorage.getItem('ADMIN')
        if(!admin){
            res.render('loginpage',{message:''})
        }
    }
    catch(e){
        res.render('loginpage',{message:''})
    }
    pool.query("select BD.*, (select S.subjectname from subjects as S where S.subjectid=BD.subjectid) as subjectname, (select BT.titlename from booktitle as BT where BT.titleid=BD.titleid) as title from bookdetails as BD",function(error,result){
        if(error){
            res.render('displayallbooks',{data:[]})
        }
        else{
            console.log(result)
            res.render('displayallbooks',{data:result})
        }
    })
})

router.get('/edit_book_data',function(req,res){
    pool.query("select BD.*, (select S.subjectname from subjects as S where S.subjectid=BD.subjectid) as subjectname, (select BT.titlename from booktitle as BT where BT.titleid=BD.titleid) as title from bookdetails as BD where BD.bookid=?",[req.query.bookid],function(error,result){
        if(error){
            res.render('displaybyid',{data:[]})
        }
        else{
            console.log(result)
            res.render('displaybyid',{data:result[0]})
        }
    })
})

router.post('/edit_book_details',function(req,res){
    if(req.body.btn=="Edit"){
        pool.query("update bookdetails set subjectid=?, titleid=?, author=?, publisher=?, price=?, offer=?, status=? where bookid=?",[req.body.subjectid, req.body.titleid, req.body.author, req.body.publisher, req.body.price, req.body.offer, req.body.status,req.body.bookid],function(error,result){
            if(error){
                res.redirect('/books/fetch_all_bookdetails')
            }
            else{
                console.log(result)
                res.redirect('/books/fetch_all_bookdetails')
            }
        })
        }
        else{
            pool.query("delete from bookdetails where bookid=?",[req.body.bookid],function(error,result){
                if(error){
                    res.redirect('/books/fetch_all_bookdstails')
                }
                else{
                    console.log(result)
                    res.redirect('/books/fetch_all_bookdetails')
                }
            })
        }
})

router.get('/displayposter',function(req,res){
   res.render('displayposter',{data:req.query})
})

router.post('/edit_poster',multer.single('poster'),function(req,res){
    pool.query("update bookdetails set poster=? where bookid=?",[req.file.originalname,req.body.bookid],function(error,result){
        if(error){
            console.log(error)
            res.redirect('/books/fetch_all_bookdetails')
        }
        else{
            res.redirect('/books/fetch_all_bookdetails') 
        }
    })
})

module.exports = router;