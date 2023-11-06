import bcrypt from 'bcrypt';
import { log } from 'console';
import * as db from '../../database/db.js';
import path from 'path';
import { crawlData } from '../../utils/crawl.js';
import fs from "fs";
import axios from 'axios';
import {exec, spawn} from 'node:child_process';
import unzipper from "unzipper";

const __dirname = path.resolve();

let manageGet = async(req,res)=>{
    if(req.session.admin){
        res.status(200).sendFile(path.join(__dirname, 'views/html/main.html'));
    }
    else{
        res.status(400).sendFile(path.join(__dirname, 'views/html/index.html'));
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
        try{
                const dbcheck = await db.getData(query, `${adminid}`)
                log("test",dbcheck);
                if(dbcheck[0] === undefined || dbcheck[0].length === 0){
                    res.status(400).json({   
                        "content_type" : "json" ,
                        "result_code" : 400 ,
                        "result_req" : "user not found" ,
                        "session" : req.session
                    })
            }
            else{
                log(password, dbcheck[0].pw)
                const hashCompare = await bcrypt.compare(password, dbcheck[0].pw);
                if(hashCompare){
                    req.session.admin = {
                        isLoggedIn : true,
                        id: dbcheck[0].adminID,
                        password: dbcheck[0].pw,
                    };
                    
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
            }
        catch{
            res.status(400).json({   
                "content_type" : "json" ,
                "result_code" : 400 ,
                "result_req" : "bad request" ,
            })
        }
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

let dashboard = async (req,res)=>{
    let query = `select count(contentsID) as number from specification;`
    let contentsNum = await db.getData(query);
    let CrawlSuccess = await db.getData(`select count(success) as number from crawlLog where success = 1`);
    let CrawlError= await db.getData(`select count(success) as number from crawlLog where success = 0`);
    contentsNum = String(contentsNum[0].number);
    CrawlSuccess = String(CrawlSuccess[0].number);
    CrawlError = String(CrawlError[0].number);
    res.status(200).json({
        "content_type" : "json" ,
        "result_code" : 200 ,
        "result_req" : "request success" ,
        contentsNum, 
        CrawlSuccess, 
        CrawlError
    })
}

let monitorDate= async (req,res)=>{
    const date = req.params.date;
    let query = `select * from logs where date = ?;`
    let logs = await db.getData(query, date);

    res.status(200).json({
        "content_type" : "json" ,
        "result_code" : 200 ,
        "result_req" : "request success" ,
        "count":logs.length,
        logs
    })
}

let monitorTime = async (req,res)=>{
    const datetime = req.params.datetime;
    let date = datetime.split(".")[0];
    let time = datetime.split(".")[1];

    let query = `select * from logs where date = ? and str_to_date(time,'%H:%i:%s') between ? and ?;`
    let logs = await db.getData(query, [date,`${time}:00:00`,`${(time+1)<25 ?time+1:"01"}:00:00`]);

    res.status(200).json({
        "content_type" : "json" ,
        "result_code" : 200 ,
        "result_req" : "request success" ,
        "count":logs.length,
        logs
    })
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
    const {contentsID, title,rawtitle,jwURL,disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director,  } = req.body
    let query = `update specification set title = ?,rawtitle=?,jwURL=?,disneyURL=?,wavveURL=?,watchaURL=?,casts=?,genre=?,jwimg=?,Offers=?,director=? where contentsID=?`;
    let values = [title,rawtitle,jwURL,disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director,contentsID];

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
    let query = ``;
    if(req.session.admin){
        
        try{
            if(userid === "selectAll"){
                query = `SELECT * FROM users`
            }
            else{
                query = `SELECT * FROM users WHERE userID like ?`
            }
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
        let sessionID = await db.getData(`select sessionID from users where userID="${userid}"`);
        
        let query = `delete from users where userID = ?`;
        
        try{
            if(sessionID !== undefined || sessionID.length !== 0){
                for(let i of JSON.parse(sessionID[0].sessionID)){
                    db.updateData(`delete from sessions where session_id = "${i}"`)
                }
            }
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
        catch(err){
            log(err)
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
    const { title,rawtitle,jwURL, disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director,  } = req.body
    let query = `insert into specification (title ,rawtitle,jwURL, disneyURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director) values(?,?,?,?,?,?,?,?,?,?,?)`;
    let values = [title,rawtitle,disneyURL,jwURL,wavveURL,watchaURL,casts,genre,jwimg,Offers,director];

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
    let title;
    let query
    if(req.session.admin){

        if(options === "selectAll"){
            query = `SELECT * FROM errLog`
        }
        else {
            title = options;
            query = `SELECT * FROM errLog WHERE title like ?`;
        }
        try{
            db.getData(query,`%${title}%`)
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

let errlogDelete = async (req,res)=>{
    const ID = req.params.options;
    if(req.session.admin){
        
        let query = `delete from errLog where ID = ?`;
        
        try{
            db.updateData(query,`${ID}`)
            .then(rows=>{
                const rowCount = rows.affectedRows
                if(rows.length !== 0 && rowCount>0){
                    res.status(200).json({
                        "content_type" : "json" ,
                        "result_code" : 200 ,
                        "result_req" : "delete success" ,
                    });
                }
                else if(rowCount === 0){
                    res.status(404).json({   
                        "content_type" : "json" ,
                        "result_code" : 404 ,
                        "result_req" : "errLog not found" ,
                    })
                }
            });
        }
        catch(err){
            log(err)
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
};

let crawl = async (req,res)=>{
    const {url} = req.body;
    if(req.session.admin){
        try{
            const crawled = await crawlData(url);
            let genre = crawled.details.split("|")[1].split(":")[1]
            let director = crawled.details.split("|")[4].split(":")[1]
            let disney = "";
            let wavve = "";
            let watcha = "";
            for(let i of crawled.hrefs.split(",")){
                if(i.includes("disney")){
                    disney = i;
                }
                if(i.includes("wavve")){
                    wavve = i;
                }
                if(i.includes("watcha")){
                    watcha = i;
                }
            }
            let query = `insert into specification (title ,rawtitle,summary,casts,jwimg,Offers,jwURL,disneyURL,wavveURL,watchaURL,genre,director) values(?,?,?,?,?,?,?,?,?,?,?,?)`;
            let values = [crawled.title,crawled.rawtitle,crawled.synopsistext,crawled.actors,crawled.imgSrc,crawled.offers,url,disney,wavve,watcha,genre,director]
            db.putData(query,values)
            db.putData(`insert into crawlLog (url,success,errmsg) values(?,?,?)`,[url,true,null]);

            res.status(200).json({
                "content_type" : "json" ,
                "result_code" : 200 ,
                "result_req" : "request success" ,
                "crawled_data": crawled,
            })
            if(crawled[0]){

            }
        }
        catch(err){
            db.putData(`insert into crawlLog (url,success,errmsg) values(?,?,?)`,[url,false,JSON.stringify(err)])
            log(err)
            res.status(400).json({   
                "content_type" : "json" ,
                "result_code" : 400 ,
                "result_req" : "Bad Request" ,
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

let download = async(req,res)=>{
    const downloadUrl = 'https://files.grouplens.org/datasets/movielens/ml-latest.zip';
    const downloadFolder = path.join(__dirname, 'downloads');

    if(req.session.admin){
        try {
            // 다운로드 폴더가 없다면 생성
            if (!fs.existsSync(downloadFolder)) {
              fs.mkdirSync(downloadFolder);
            }
        
            // 파일 다운로드
            const response = await axios({
              method: 'GET',
              url: downloadUrl,
              responseType: 'stream'
            });
        
            // ZIP 파일을 다운로드하고 압축 해제하여 저장
            await response.data.pipe(unzipper.Extract({ path: downloadFolder })).promise();
        
            const preprocessed = path.join(__dirname,'ml', 'preprocessed.csv');
            const directory = fs.existsSync(preprocessed);
            if(directory){
                fs.unlinkSync(preprocessed);
                log("renewed file")
            }

            const cwd = path.join(__dirname,'ml')
            // Python 스크립트 실행 (preprocess.py)
            const pythonProcess = exec('python3 preprocess.py', { cwd: cwd }, (error, stdout, stderr) => {
                log("Start Preprocess");
              if (error) {
                console.error(`Error: ${error.message}`);
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "Error processing the file" ,
                })
                return;
              }
              if (stderr) {
                console.error(`Stderr: ${stderr}`);
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "Error processing the file" ,
                })
                return;
              }
        
              console.log(`Python script output: ${stdout}`);
              res.status(200).json({   
                "content_type" : "json" ,
                "result_code" : 200 ,
                "result_req" : "File processed successfully" ,
            })
            });

          } catch (error) {
            console.error('처리 중 오류가 발생했습니다:', error);
            res.status(400).json({   
                "content_type" : "json" ,
                "result_code" : 400 ,
                "result_req" : "Error processing the file" ,
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

let train = async(req,res)=>{
    const pythonPath = path.join(__dirname, "ml",'vacs.py');
    
    if(req.session.admin){
        
        res.status(200).json({   
            "content_type" : "json" ,
            "result_code" : 200 ,
            "result_req" : "Training On" ,
        })
        const pythonProcess = spawn('python', [pythonPath],{
            detached:true,
            stdio: ['ignore',out,err],
        });

        pythonProcess.unref();

    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "Unauthorized" ,
        })
    }
}


let dispatch = async(req,res)=>{
    const pythonPath = path.join(__dirname, "ml",'dispatch.py');
    const pickle = path.join(__dirname, "../ml",'encoded_250000.pickle');
    const out = fs.openSync('./out.log', 'a');
    const err = fs.openSync('./err.log', 'a');
    let start = await db.getData(`select count(recc) as number from moviecsv`);
    start = Number(start[0].number);
    if(req.session.admin){
        res.status(200).json({   
            "content_type" : "json" ,
            "result_code" : 200 ,
            "result_req" : "dispatch on process" ,
        })

        const pythonProcess = spawn('python3', [pythonPath,pickle,start ],{
            detached: true,
            stdio: ['ignore',out,err],
        })

        pythonProcess.unref();

    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "Unauthorized" ,
        })
    }
}

let stopTrain = async(req,res)=>{
    if(req.session.admin){
        exec('pkill -f vacs.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                res.status(400).json({
                    "content_type": "json",
                    "result_code": 400,
                    "result_req": "Error stopping dispatch process",
                });
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                res.status(400).json({
                    "content_type": "json",
                    "result_code": 400,
                    "result_req": "Error stopping dispatch process",
                });
                return;
            }
            console.log(`Stopped dispatch process: ${stdout}`);
            res.status(200).json({
                "content_type": "json",
                "result_code": 200,
                "result_req": "Train process stopped successfully",
            });
        });
    }
    else{
        res.status(401).json({   
            "content_type" : "json" ,
            "result_code" : 401 ,
            "result_req" : "Unauthorized" ,
        })
    }
}

let stopDispatch = async(req,res)=>{
    if(req.session.admin){
        exec('pkill -f dispatch.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                res.status(400).json({
                    "content_type": "json",
                    "result_code": 400,
                    "result_req": "Error stopping dispatch process",
                });
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                res.status(400).json({
                    "content_type": "json",
                    "result_code": 400,
                    "result_req": "Error stopping dispatch process",
                });
                return;
            }
            console.log(`Stopped dispatch process: ${stdout}`);
            res.status(200).json({
                "content_type": "json",
                "result_code": 200,
                "result_req": "Dispatch process stopped successfully",
            });
        });
    }
    else{
        res.status(401).json({   
            "content_type" : "json",
            "result_code" : 401 ,
            "result_req" : "Unauthorized"
        })
    }
}

export {manageGet,userSearch, userDelete, adminLogin, adminLogout,dashboard,monitorDate,monitorTime, contentsSearch, updateRow, errLogGet,errlogDelete ,ottManagePost, crawl,download, train, dispatch,stopTrain,stopDispatch};