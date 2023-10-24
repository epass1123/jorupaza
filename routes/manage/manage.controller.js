import bcrypt from 'bcrypt';
import { log } from 'console';
import * as db from '../../database/db.js';
import path from 'path';
const __dirname = path.resolve();

let manageGet = async(req,res)=>{
    if(req.session.admin){
        res.status(200).render(path.join(__dirname, 'views/html/main.html'));
    }
    else{
        res.status(401).render(path.join(__dirname, 'views/html/index.html'));
    }
}   

let adminLogin = async (req,res)=>{
    let {adminid,password} = req.body; 
    const timestamp = Date.now();
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let query = `SELECT adminID, pw FROM admin WHERE adminID= ?`;

    if(req.session.admin){
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "Already logged in" ,
     })
    }
    else{
            db.getData(query, `${adminid}`)
            .then(rows=>{
                log(rows)
                if(rows.length === 0){
                    res.status(400).json({   
                        "content_type" : "json" ,
                        "result_code" : 400 ,
                        "result_req" : "User not found" ,
                        "session" : req.session
                 })
                }
                else{
                    const check = (password === rows[0].pw);
                    // bcrypt.compare(password, rows.pw);
                    if(check){
                        req.session.admin = {
                            isLoggedIn : true,
                            id: rows[0].adminID,
                            pw: rows[0].pw
                        };
                        log("session:",req.session)
                        res.status(200).json({   
                            "content_type" : "json" ,
                            "result_code" : 200 ,
                            "result_req" : "login success" ,
                            "session" : req.session
                     })
                    }
                    else{
                        res.status(400).json({   
                            "content_type" : "json" ,
                            "result_code" : 400 ,
                            "result_req" : "wrong password" ,
                            "session" : req.session
                     })
                    }
                }
            })
    }
};

  
let adminLogout = async(req, res)=>{
    log("logout", req.session)

    if(req.session.admin){
        req.session.destroy((err) => {
            if (err) {
                console.log("세션 삭제시에 에러가 발생했습니다.");
                return res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "bad request" ,
             })
            }
            return res.status(200).json({
                "content_type" : "json" ,
                "result_code" : 200 ,
                "result_req" : "logout success" ,
                "session" : req.session
            })
        });
    }else{
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "not logged in" ,
     })
    }
    
  }

let contentsSearch = async (req,res)=>{
    const {option, input, } = req.body
    let query = "";
    if(req.session.admin){

        if(option === "title"){
            query = `SELECT * FROM specification WHERE title like ?`
        }
        else if(option === "rawtitle"){
            query = `SELECT * FROM specification WHERE rawtitle like ?`
        }
        try{
            db.getData(query,`%${input}%`)
            .then((rows)=>{
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    "possible_match": rows,
                })
            });
        }
        catch{
            res.status(400).json({
                "content-type": "json",
                "result_code": 400,
                "result_req": "bad request"
            });
        }
    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "Unauthorized" ,
        })
    }
};

let updateRow = async (req,res)=>{
    const {contentsID, title,rawtitle,disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director,  } = req.body
    let query = `update specification set title = ?,rawtitle=?,disneyURL=?,wavveURL=?,watchaURL=?,casts=?,genre=?,jwimg=?,Offers=?,director=? where contentsID=?`;
    let values = [title,rawtitle,disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director,contentsID];

    if(req.session.admin){

        try{
            db.updateData(query,values)
            .then(rows=>{
                log(rows);
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "update success" ,
                });
            });
        }
        catch{
            res.status(400).json({
                "content-type": "json",
                "result_code": 400,
                "result_req": "bad request"
            });
        }
    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "Unauthorized" ,
        })
    }
};

let userSearch = async(req,res)=>{
    const userid = req.params.userid;
    if(req.session.admin){
        let query = `SELECT * FROM users WHERE userID like ?`
        try{
            db.getData(query,`%${userid}%`)
            .then(rows=>{
                if(rows.length !== 0){
                    res.status(200).json({
                        "content_type" : "json" ,
                        "result_code" : 200 ,
                        "result_req" : "request success" ,
                        "possible_match" : rows
                    });
                }
                else{
                    res.status(400).json({   
                        "content_type" : "json" ,
                        "result_code" : 400 ,
                        "result_req" : "no user" ,
                    })
                }
            });
        }
        catch{
            res.status(400).json({   
                "content_type" : "json" ,
                "result_code" : 400 ,
                "result_req" : "bad request" ,
            })
        }
    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "unauthorized" ,
        })
    }
}

  let userDelete = async(req,res)=>{
    const userid = req.params.userid;
    if(req.session.admin){
        let query = `delete from users where userID = ?`
        try{
            db.updateData(query,`${userid}`)
            .then(rows=>{
                const rowCount = rows.affectedRows
                if(rows.length !== 0 && rowCount>0){
                    res.status(200).json({
                        "content_type" : "json" ,
                        "result_code" : 200 ,
                        "result_req" : "request success" ,
                    });
                }
                else if(rowCount === 0){
                    res.status(400).json({   
                        "content_type" : "json" ,
                        "result_code" : 400 ,
                        "result_req" : "no user" ,
                    })
                }
            });
        }
        catch{
            res.status(400).json({   
                "content_type" : "json" ,
                "result_code" : 400 ,
                "result_req" : "bad request" ,
            })
        }
    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "Unauthorized" ,
        })
    }
}


let ottManagePost = async (req,res)=>{
    const { title,rawtitle,disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director,  } = req.body
    let query = `insert into specification (title ,rawtitle,disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director) values(?,?,?,?,?,?,?,?,?,?)`;
    let values = [title,rawtitle,disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director];

    if(req.session.admin){
        try{
            db.putData(query,values)
            .then(rows=>{
                log(rows);
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "add success" ,
                });
            });
        }
        catch{
            res.status(400).json({
                "content-type": "json",
                "result_code": 400,
                "result_req": "bad request"
            });
        }
    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "Unauthorized" ,
        })
    }
};


let errLogGet = async (req,res)=>{
    const options = req.params.options;
    let query
    if(req.session.admin){

        if(options === "all"){
            query = `SELECT * FROM errLog`
        }
        else if(options === "disney"){
            query = `SELECT * FROM errLog WHERE type = disney`
        }
        else if(options === "wavve"){
            query = `SELECT * FROM errLog WHERE type = wavve`
        }
        else if(options === "watcha"){
            query = `SELECT * FROM errLog WHERE type = watcha`
        }
        try{
            db.getData(query)
            .then((rows)=>{
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    "err_logs": rows,
                })
            });
        }
        catch{
            res.status(400).json({
                "content-type": "json",
                "result_code": 400,
                "result_req": "bad request"
            });
        }
    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "Unauthorized" ,
        })
    }
};


export {manageGet,userSearch, userDelete, adminLogin, adminLogout,contentsSearch, updateRow, errLogGet,ottManagePost};