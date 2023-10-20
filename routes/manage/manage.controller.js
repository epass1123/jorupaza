import bcrypt from 'bcrypt';
import { log } from 'console';
import * as db from '../../database/db.js';
import path from 'path';
const __dirname = path.resolve();


let manageGet = async(req,res)=>{
    res.sendFile(path.join(__dirname, 'views/html/index.html'));
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

    db.getData(query, `${adminid}`)
    .then(rows=>{
        log(rows)
        if(rows.length === 0){
            res.status(400).json({   
                "content_type" : "json" ,
                "result_code" : 400 ,
                "result_req" : "등록되지 않은 회원입니다." ,
                "session" : req.session
         })
        }
        else{
            const check = (password === rows[0].pw);
            // bcrypt.compare(password, rows.pw);
            if(check){
                req.session.user = rows;
                log("session:",req.session)
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

  
let adminLogout = async(req, res)=>{
    log("logout", req.session)

    if(req.session.user){
        req.session.destroy((err) => {
            if (err) {
                console.log("세션 삭제시에 에러가 발생했습니다.");
                return;
            }
            return res.status(200).json({
                "content_type" : "json" ,
                "result_code" : 200 ,
                "result_req" : "logout success" ,
                "session" : req.session
            })
            
            
        });
        log(req.session);
    }else{
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "not logged in" ,
     })
    }
    
  }




export {manageGet, adminLogin, adminLogout};