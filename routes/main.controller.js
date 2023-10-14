// import bcrypt from 'bcrypt';
import { log } from 'console';
// import jwt from "jsonwebtoken";
import * as db from "../database/db.js";

let userInfoGet = async(req,res)=>{
    const userid = req.params.userid;
    // log(userid);
    let query = `SELECT * FROM users WHERE userID= ?`
    log("userInfoGet", req.ip);
    db.getData(query,`${userid}`)
    .then((rows)=>{
        if(rows.length !== 0){
            res.status(200).json({
                "content_type" : "json" ,
                "result_code" : 200 ,
                "result_req" : "request success" ,
                "user_setting" : rows[0].useSet
            })
        }
        else{
            res.status(400).json({   
                "content_type" : "json" ,
                "result_code" : 400 ,
                "result_req" : "wrong userid" ,
            })
        }
    }
    );
}

let userBehaviorGet = async(req,res)=>{
    const start = req.params.start;
    const end = req.params.end;
    // log(userid);
    let query = `SELECT * FROM users WHERE userID= ?`
    log("userInfoGet", req.ip);
    db.getData(query,`${userid}`)
    .then((rows)=>{
        if(rows.length !== 0){
            res.status(200).json({
                "content_type" : "json" ,
                "result_code" : 200 ,
                "result_req" : "request success" ,
                "user_setting" : rows[0]
            })
        }
        else{
            res.status(400).json({   
                "content_type" : "json" ,
                "result_code" : 400 ,
                "result_req" : "wrong userid" ,
            })
        }
    });
}

let userBehaviorPost = async(req,res)=>{
    const start = req.params.start;
    const end = req.params.end;
    // log(userid);
    let query = `SELECT * FROM users WHERE userID= ?`
    log("userInfoGet", req.ip);
    db.getData(query,`${userid}`)
    .then((rows)=>{
        res.status(200).json({
            "content_type" : "json" ,
            "result_code" : 200 ,
            "result_req" : "request success" ,
            "user_setting" : rows[0]
        })
    });
}

let markGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    log("get",req.ip,userid);
    let query1 = `SELECT * FROM marked_channel WHERE userID = "${userid}";`;
    let query2 = `SELECT * FROM marked_youvid WHERE userID = "${userid}";`;
    let query3 = `SELECT * FROM marked_ott WHERE userID = "${userid}";`;
    let query4 = `SELECT * FROM marked_streamer WHERE userID = "${userid}";`;
    
    let result = [];
    db.getData(query1+query2+query3+query4)
    .then((rows)=>{
        result.push({"marked_channel":rows[0]})
        result.push({"marked_youvid":rows[1]})
        result.push({"marked_ott":rows[2]})
        result.push({"marked_streamer":rows[3]})
        res.send(result)
    })
    // let marked_streamer = db.getData("*","marked_streamer",`userID= "${userid}"`);
};

let markPost = async (req,res)=>{
    log("markPost",req.ip)
    const userid = req.params.userid; //userid
    let body = req.body; 
    // let marked_youvid = db.getData("*","marked_youvid",`userID= "${userid}"`);
    // let marked_ott = db.getData("*","marked_ott",`userID= "${userid}"`);
    db.putData()
    .then(rows=>{
        res.send(rows);
    })
};

let loginPost = async (req, res) => {
    const userid = req.params.userid;
    let values;
    log(userData);
    let query = ``;
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    try {
        db.chkUser(userid)
        .then((res)=>{
            if(res.length === 0){
                values.push(userid, req.body.email, now, "default", now);
                query = `INSERT INTO users (userID,email,regiTime,useSet,timestamp) VALUES= ?`
                db.putData(query,values);
            }
        })
    }catch(err){
        console.log(err);
        return res.status(400).send({ err: err.message });
    }
};
  
let logoutGet = async(req, res)=>{
        if(req.session.user){
          req.session.destroy(() => {
            if (err) {
                console.log("세션 삭제시에 에러가 발생했습니다.");
                return;
              }
          });
          console.log(req.session);
        }
      }

let searchGet = async (req,res)=>{
    const title = req.query.title; //검색어
    let query = `SELECT * FROM specification WHERE title= ?`
    log("get", req.ip, req.query);
    db.getData(query,`${title}`)
    .then((rows)=>{
        res.send(rows);
    });
};

let searchPost = async (req,res)=>{
    log(req.ip)
    const title = req.query.title; //검색어
    log("searchPost", req.body);
    db.getData("*", "specification", `title= ?`,`${title}`)
    .then((rows)=>{
        res.send(rows);
    });
};

let contentPost = async (req,res)=>{
    const adminID = req.params.adminid;
    const url = req.query.url;
    if(adminID === "jorupaza"){
        db.putData("specification", )
    }
};

let youvidGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    db.getData("*","marked_youvid",`userID= ?`,`${userid}`)
    .then((rows)=>{
        res.send(rows);
    })
};

let youvidPost = async (req,res)=>{
    log("youvidPost",req.ip)
    const userid = req.params.userid; //userid
    const vID = req.body.vidList;
    const groupSet = req.body.settingList;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    let values = [];
    values.push(userid, vID[0], groupSet[0], now);

    let query = `INSERT INTO marked_youvid (userID,vID,groupSet,timestamp) VALUES (?,?,?,?)`
    db.putData(query, values)
    .then(rows=>{
        res.send(rows);
    })
};
let ottGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    db.getData("*","marked_ott",`userID= ?`,`${userid}`)
    .then((rows)=>{
        res.send(rows);
    })
};

let ottPost = async (req,res)=>{
    log("ottPost",req.ip)
    const userid = req.params.userid; //userid
    const contentsID = req.body.id;
    const ottID = req.body.ottidList;
    const title = req.body.titleList;
    const img = req.body.imgList;
    const url = req.body.urlList;
    const groupSet = req.body.settingList;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    let values = [];
    values.push(userid, Number(contentsID), ottID[0], title[0],img[0],url[0],groupSet[0], now);
    // `("${userid}",16,"${ottID}","${title}","${img}","${url}","${groupSet}","${today}")`;

    let query = `INSERT INTO marked_ott (userID, contentsID, ottID, title, img, url, groupSet, timestamp) VALUES (?,?,?,?,?,?,?,?)`
    db.putData(query, values)
    .then(rows=>{
        res.send(rows);
    })
};

let streamerGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    db.getData("*","marked_streamer",`userID= ?`,`${userid}`)
    .then((rows)=>{
        res.send(rows);
    })
};

let streamerPost = async (req,res)=>{
    log("streamerPost",req.ip)
    const userid = req.params.userid; //userid
    const streamerID = req.body.vidList;
    const groupSet = req.body.settingList;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    let values = [];
    values.push(userid, streamerID[0], groupSet[0], now);

    let query = `INSERT INTO marked_streamer (userID,streamerID,groupSet,timestamp) VALUES (?,?,?,?)`
    db.putData(query, values)
    .then(rows=>{
        res.send(rows);
    })
};

let channelGet = async (req,res)=>{
    const userid = req.params.userid; //userid
    db.getData("*","marked_channel",`userID= ?`,`${userid}`)
    .then((rows)=>{
        res.send(rows);
    })
};

let channelPost = async (req,res)=>{
    log("channelPost",req.ip)
    const userid = req.params.userid; //userid
    const channelID = req.body.vidList;
    const title = req.body.title;
    const groupSet = req.body.settingList;
    const timestamp = Date.now()
    const today = new Date(timestamp);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    let values = [];
    values.push(userid, channelID[0], groupSet[0], now);

    let query = `INSERT INTO marked_streamer (userID,channelID,groupSet,timestamp) VALUES (?,?,?,?)`
    db.putData(query, values)
    .then(rows=>{
        res.send(rows);
    })
};




export {userBehaviorGet,searchPost,userInfoGet,loginPost,logoutGet,markGet,markPost,youvidGet,youvidPost,ottGet,ottPost,channelGet,channelPost,streamerGet,streamerPost,searchGet,contentPost,userBehaviorPost}
