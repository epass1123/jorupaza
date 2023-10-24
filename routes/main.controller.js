import bcrypt from 'bcrypt';
import { log } from 'console';
import jwt from "jsonwebtoken";
import * as db from "../database/db.js";
import path from 'path';
const __dirname = path.resolve();

let mainGet = async(req,res)=>{
    res.sendFile(path.join(__dirname, 'views/html/boot.html'));
}   

let register = async(req,res)=>{
    let {userid,password,email} = req.body; 
    const timestamp = Date.now();
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const insert = `insert into users (userID, password ,email, regiTime, useSet ,timestamp) values(?,?,?,?,?,?)`;
    const select = `SELECT userID FROM users WHERE userID= ?`;
    const hashPassword = await bcrypt.hash(password,12);
    const useSet = [{"type" : "ottGroups","setting" : ["최근 추가된 OTT 콘텐츠"]},{"type" : "channelGroups","setting" : ["최근 추가된 채널"]},{"type" : "youvidGroups","setting" : ["최근 추가된 유튜브 영상"]},{"type" : "streamerGroups","setting" : ["최근 추가된 스트리머"]},{"type" : "darkmode","setting" : 0},{"type" : "subscription","setting" : "netflix,disneyplus,wavve,watcha,youtube,twitch"}];

    if(req.session.user){
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "already logged in" ,
     })
    }
    else{
        db.getData(select, userid)
        .then(rows=>{
            if(rows.length !== 0){
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "duplicate userID" ,
             })
            }
            else{
                db.putData(insert,[userid,hashPassword,email,now,`${JSON.stringify(useSet)}`,now])
                .then(p=>{
                    res.status(200).json({   
                        "content_type" : "json" ,
                        "result_code" : 200 ,
                        "result_req" : "registered successfully" ,
                    })
                })
            }
        })

    }
}

let loginPost = async (req,res)=>{
    let {userid,password} = req.body; 
    const timestamp = Date.now();
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let query = `SELECT userID, password FROM users WHERE userID = ?`;

    if(req.session.user){
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "already logged in" ,
     })
    }
    else{   
        try{
            const dbcheck = await db.getData(query, `${userid}`)
            if(dbcheck[0] === undefined){
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "user not found" ,
                    "session" : req.session
                })
            }
            else{
                const hashCompare = await bcrypt.compare(password, dbcheck[0].password);
                if(hashCompare){
                    req.session.user = {
                        isLoggedIn : true,
                        id: dbcheck[0].userID,
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

let logoutGet = async(req, res)=>{
    log("logout", req.session)

    try{
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
    catch{
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "Bad Request" ,
        })
    }
}

let userInfoGet = async(req,res)=>{
    const userid = req.params.userid;
    // log(userid);
    let query = `SELECT * FROM users WHERE userID= ?`
    try{
        db.getData(query,`${userid}`)
        .then(rows=>{
            if(rows.length !== 0){
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    "user_setting" : rows[0]?rows[0].useSet:"none"
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


let userInfoPost = async (req, res) => {
    const userid = req.params.userid;
    const {useSet,email} = req.body;
    let query = ``;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    
    try {
        query = `update users set useSet = ?, timestamp = ? where userid = ?`
        let values = [email,`${JSON.stringify(useSet)}`, now ,userid];
        db.putData(query,values)
        .then(p=>{
            if(p !== undefined){
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    })
            }
            else{
                res.status(400).json({
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "No user" ,
                })
            }
        });
            
            
        
    }catch(err){
        console.log(err);
        res.status(400).json({
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "bad request" ,
            })
    }
};

let userBehaviorGet = async(req,res)=>{
    const userID = req.params.userid;
    const start = new Date(req.params.start);
    const end = req.params.end;
    log(req.params);
    let query = `SELECT * FROM user_behavior WHERE userID= ? and timestamp between ? and ?`
    try{
        db.getData(query,[`${userID}`,`${start}`,`${end}`])
        .then(rows=>{
            if(rows !== undefined){
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    "user_behavior" : rows
                })
            }
            else{
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "no data" ,
                })
            }
        })
    }
    catch{
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "bad request" ,
        })
    }
}

let userBehaviorPost = async(req,res)=>{
    const userID = req.params.userid;
    const event_target = req.body.event_target;
    const event_type = req.body.event_type;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let query = `INSERT INTO user_behavior (userID, event_type, event_target, timestamp) VALUES(?,?,?,?)`

    try{
        db.putData(query,[userID,event_type,event_target,now])
        .then((rows)=>{
            if(rows.length !== 0){
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                })
            }
            else{
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "insert failed" ,
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

let markGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    if(!userid){
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "bad request" ,
        })
    }
    else{
        let query1 = `SELECT * FROM marked_channel WHERE userID = "${userid}";`;
        let query2 = `SELECT * FROM marked_youvid WHERE userID = "${userid}";`;
        let query3 = `SELECT * FROM marked_ott WHERE userID = "${userid}";`;
        let query4 = `SELECT * FROM marked_streamer WHERE userID = "${userid}";`;
        
        let result = {};
        try{
            db.getData(query1+query2+query3+query4)
            .then((rows)=>{
                if(rows.length !== 0){
                    result = {
                        "marked_channel":rows[0][0],
                        "marked_youvid":rows[1][0],
                        "marked_ott":rows[2][0],
                        "marked_streamer":rows[3][0]
                    }
                    res.status(200).json({
                        "content_type" : "json" ,
                        "result_code" : 200 ,
                        "result_req" : "request success" ,
                        result,
                    })
                }
                else{
                    res.status(400).json({   
                        "content_type" : "json" ,
                        "result_code" : 400 ,
                        "result_req" : "no data" ,
                    })
                }
            })
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

let searchGet = async (req,res)=>{
    const title = req.params.title; //검색어
    let query = `SELECT * FROM specification WHERE title like ?`
    try{
        db.getData(query,`%${title}%`)
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
};

let ottGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    let query = `SELECT * FROM marked_ott WHERE userID= ?`

    try{
        db.getData(query,`${userid}`)
        .then((rows)=>{
            if(rows.length !== 0){
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    "marked_ott": rows,
                })
            }
            else{
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "no data" ,
                })
            }
        })
    }
    catch{
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "bad request" ,
        })
    }
};

let ottPost = async (req,res)=>{
    const requserid = req.params.userid; //userid
    const userid = req.body.id; 
    const contentsID = req.body.contentsid;
    // log(req.body)
    
    const ottID = req.body.ottidList;
    const title = req.body.titleList;
    const img = req.body.imgList;
    let url = req.body.urlList;
    const groupSet = req.body.settingList;
    const type = req.body.typeList;

    const timestamp = Date.now();
    const today = new Date(timestamp);
    let selectQuery = ``;
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let logQuery = ""
    let inputs = [];
    try{
        if(type.length === 0){
            let values = [requserid, `${contentsID}`, `${ottID.join("|")}`, `${title.join("|")}`, `${img.join("|")}`, `${url.join("|")}`, `${groupSet.join("|")}`, `${type.join("|")}`,now];
            let query = `INSERT INTO marked_ott (userID, contentsID, ottID, title, img, url, groupSet, type ,timestamp) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE contentsID=VALUES(contentsID), ottID=VALUES(ottID), title=VALUES(title), img=VALUES(img), url=VALUES(url), groupSet=VALUES(groupSet),type=VALUES(type), timestamp=VALUES(timestamp)`

            db.putData(query, values)
        }
        for(let i in type){
            if(type[i] === "Disney Plus"){
                selectQuery = `SELECT title,disneyURL,Offers from specification where (title = "${title[i]}" or rawtitle = "${title[i]}")`;
                db.getData(selectQuery)
                    .then(rows=>{
                        if(rows.length == 0){
                            logQuery = `insert into errLog (type,title,message,timestamp) values(?,?,?,?) ON DUPLICATE KEY UPDATE message=VALUES(message), timestamp=VALUES(timestamp)`
                            inputs = ["disney",title[i],"title not found",now];
                            db.putData(logQuery, inputs)

                        }else{
                            if(rows[0].disneyURL == null){
                                logQuery = `insert into errLog (type,title,message,timestamp) values(?,?,?,?) ON DUPLICATE KEY UPDATE message=VALUES(message), timestamp=VALUES(timestamp)`
                                inputs = ["disney",title[i],"disneyURL not found",now];
                                db.putData(logQuery, inputs)

                            }
                            else{
                                url[i] = rows[0].disneyURL;
                                let values = [requserid, `${contentsID}`, `${ottID.join("|")}`, `${title.join("|")}`, `${img.join("|")}`, `${url.join("|")}`, `${groupSet.join("|")}`, `${type.join("|")}`,now];
    
                                let query = `INSERT INTO marked_ott (userID, contentsID, ottID, title, img, url, groupSet, type ,timestamp) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE contentsID=VALUES(contentsID), ottID=VALUES(ottID), title=VALUES(title), img=VALUES(img), url=VALUES(url), groupSet=VALUES(groupSet),type=VALUES(type), timestamp=VALUES(timestamp)`
    
                                db.putData(query, values)
                            }
                        }
                    })
            }
            else if(type[i] === "wavve"){
                selectQuery = `SELECT title, wavveURL, Offers from specification where (title = "${title[i]}" or rawtitle = "${title[i]}")`;
    
                db.getData(selectQuery)
                    .then(rows=>{
    
                        if(rows.length == 0){
                            logQuery = `insert into errLog (type,title,message,timestamp) values(?,?,?,?) ON DUPLICATE KEY UPDATE message=VALUES(message), timestamp=VALUES(timestamp)`
                            inputs = ["wavve",title[i],"title not found",now];
                            db.putData(logQuery, inputs)
                        }else{
    
                            if(rows[0].wavveURL == null){
                                logQuery = `insert into errLog (type,title,message,timestamp) values(?,?,?,?) ON DUPLICATE KEY UPDATE message=VALUES(message), timestamp=VALUES(timestamp)`
                                inputs = ["wavve",title[i],"wavveURL not found",now];
    
                                db.putData(logQuery, inputs)
                            }
                            else{
                                url[i] = rows[0].wavveURL;
                                let values = [requserid, `${contentsID}`, `${ottID.join("|")}`, `${title.join("|")}`, `${img.join("|")}`, `${url.join("|")}`, `${groupSet.join("|")}`, `${type.join("|")}`,now];
    
                                let query = `INSERT INTO marked_ott (userID, contentsID, ottID, title, img, url, groupSet, type ,timestamp) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE contentsID=VALUES(contentsID), ottID=VALUES(ottID), title=VALUES(title), img=VALUES(img), url=VALUES(url), groupSet=VALUES(groupSet),type=VALUES(type), timestamp=VALUES(timestamp)`
    
                                db.putData(query, values)
                            }
                        }
    
                    })
            }
        else if(type[i] === "Watcha"){
            let watchaID = url[i].split("/").pop();
            selectQuery = `SELECT title, watchaURL, Offers from specification where watchaURL like "%${watchaID}%"`;

            db.getData(selectQuery)
                .then(rows=>{
                    title[i] = rows[0].title;
                    let values = [requserid, `${contentsID}`, `${ottID.join("|")}`, `${title.join("|")}`, `${img.join("|")}`, `${url.join("|")}`, `${groupSet.join("|")}`, `${type.join("|")}`,now];

                    let query = `INSERT INTO marked_ott (userID, contentsID, ottID, title, img, url, groupSet, type ,timestamp) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE contentsID=VALUES(contentsID), ottID=VALUES(ottID), title=VALUES(title), img=VALUES(img), url=VALUES(url), groupSet=VALUES(groupSet),type=VALUES(type), timestamp=VALUES(timestamp)`

                    db.putData(query, values)
                })
        }
        else{
            let values = [requserid, `${contentsID}`, `${ottID.join("|")}`, `${title.join("|")}`, `${img.join("|")}`, `${url.join("|")}`, `${groupSet.join("|")}`, `${type.join("|")}`,now];

            let query = `INSERT INTO marked_ott (userID, contentsID, ottID, title, img, url, groupSet, type ,timestamp) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE contentsID=VALUES(contentsID), ottID=VALUES(ottID), title=VALUES(title), img=VALUES(img), url=VALUES(url), groupSet=VALUES(groupSet),type=VALUES(type), timestamp=VALUES(timestamp)`

            db.putData(query, values)
        }
    }
        
        res.status(200).json({
            "content-type": "json",
            "result_code": 200,
            "result_req": "post done"
        });

    }
    catch(err){
        res.status(400).json({
            "content-type": "json",
            "result_code": 400,
            "result_req": err
        });
    }
};

let youvidGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    let query = `SELECT * FROM marked_youvid WHERE userID= ?`
    try{
        db.getData(query,`${userid}`)
        .then((rows)=>{
            if(rows.length !== 0){
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    "marked_youvid": rows,
                })
            }else{
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "no data" ,
                })
            }
        })
    }
    catch{
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "bad request" ,
        })
    }
};

let youvidPost = async (req,res)=>{
    const requserid = req.params.userid; //userid
    const userid = req.body.id;
    const vID = req.body.vidList;
    const groupSet = req.body.settingList;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    let query = `INSERT INTO marked_youvid (userID,vID,groupSet,timestamp) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE vID=VALUES(vID), groupSet=VALUES(groupSet), timestamp=VALUES(timestamp)`
    //구분 용이하게 하기위해 |로 join
    let values = [requserid, `${vID.join("|")}`, `${groupSet.join("|")}`, now];

    db.putData(query, values)
    .then(rows=>{
        if(rows === undefined){
            res.status(400).json({
                "content-type": "json",
                "result_code": 400,
                "result_req": "bad request"
            });
        }else{
            res.status(200).json({
                "content-type": "json",
                "result_code": 200,
                "result_req": "post done"
            });
        }
        
    }); 

};

let streamerGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    let query = `SELECT * FROM marked_streamer WHERE userID= ?`

    try{
        db.getData(query,`${userid}`)
        .then((rows)=>{
            if(rows.length !== 0){
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    "marked_streamer": rows,
                })
            }
            else{
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "no data" ,
                })
            }
        })
    }
    catch{
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "bad request" ,
        })
    }
};

let streamerPost = async (req,res)=>{
    const requserid = req.params.userid; //userid
    const userid = req.params.userid; //

    const streamerID = req.body.idList;
    const groupSet = req.body.settingList;
    const title = req.body.titleList;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    let query = `INSERT INTO marked_streamer (userID,streamerID,groupSet,title,timestamp) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE streamerID=VALUES(streamerID), groupSet=VALUES(groupSet),title=VALUES(title), timestamp=VALUES(timestamp)`
    let values = [requserid, `${streamerID.join("|")}`, `${groupSet.join("|")}`,`${title.join("|")}`, now];

    db.putData(query, values)
    .then(rows=>{
        if(rows === undefined){
            res.status(400).json({
                "content-type": "json",
                "result_code": 400,
                "result_req": "bad request"
            });
        }else{
            res.status(200).json({
                "content-type": "json",
                "result_code": 200,
                "result_req": "post done"
            });
        }
        
    }); 
};

let channelGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    let query = `SELECT * FROM marked_channel WHERE userID= ?`

    try{
        db.getData(query,`${userid}`)
        .then((rows)=>{
            if(rows.length !== 0){
                res.status(200).json({
                    "content_type" : "json" ,
                    "result_code" : 200 ,
                    "result_req" : "request success" ,
                    "marked_channel": rows,
                })
            }
            else{
                res.status(400).json({   
                    "content_type" : "json" ,
                    "result_code" : 400 ,
                    "result_req" : "no data" ,
                })
            }
        })
    }
    catch{
        res.status(400).json({   
            "content_type" : "json" ,
            "result_code" : 400 ,
            "result_req" : "bad request" ,
        })
    }
};

let channelPost = async (req,res)=>{
    const requserid = req.params.userid; //userid
    const channelID = req.body.cidList;
    const img = req.body.imgList;
    const title = req.body.cnameList;
    const groupSet = req.body.settingList;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    let query = `INSERT INTO marked_channel (userID,channelID,title,img,groupSet,timestamp) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE channelID=VALUES(channelID), groupSet=VALUES(groupSet), timestamp=VALUES(timestamp), title=VALUES(title), img=VALUES(img)`
    let values = [requserid, `${channelID.join("|")}`, `${title.join("|")}`,`${img.join("|")}`,`${groupSet.join("|")}`, now];

    db.putData(query, values)
    .then(rows=>{
        if(rows === undefined){
            res.status(400).json({
                "content-type": "json",
                "result_code": 400,
                "result_req": "bad request"
            });
        }else{
            res.status(200).json({
                "content-type": "json",
                "result_code": 200,
                "result_req": "post done"
            });
        }
        
    }); 
};

export {mainGet,register,loginPost,userBehaviorGet,logoutGet,userInfoGet,userInfoPost,markGet,youvidGet,youvidPost,ottGet,ottPost,channelGet,channelPost,streamerGet,streamerPost,searchGet,userBehaviorPost}
  