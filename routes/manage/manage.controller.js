import bcrypt from 'bcrypt';
import { log } from 'console';
import * as db from '../../database/db.js';
import path from 'path';
const __dirname = path.resolve();


let manageGet = async(req,res)=>{
    res.sendFile(path.join(__dirname, './login.html'));
}   

let adminLogin = async (req,res)=>{
    const adminid = req.params.adminid; //userid
    log(adminid);
    let {userid,password} = req.body; 
    const timestamp = Date.now();
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let query = `SELECT adminid, pw FROM admin WHERE adminID= ?`;
    let values = [];
    // values.push(adminid, body.password, "default", now);
    log("Post adminLogin", req.body)
    db.getData(query, `${adminid}`)
    .then(rows=>{
        if(rows.length === 0){
            res.send("등록되지 않은 회원입니다");
        }
        else{
            const check = (password === rows[0].pw);
            // bcrypt.compare(password, rows.pw);
            if(check){
                req.session.user = rows;
                res.status(200).json({   
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "login success" ,
                    "session" : req.session
             })
            }
            else{
                req.session.user = "";
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "wrong password" ,
                    "session" : req.session
             })
            }
        }
    })
};



export {manageGet, adminLogin};