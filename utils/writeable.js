import { Writable } from "stream";
Writable.Writable;

import * as db from "../database/db.js"
import { log } from "console";

let sql = `INSERT INTO logs (userID, method, url, day, date, time, resCode) values(?,?,?,?,?,?,?)`;

class MyStream extends Writable {
    write(line) {
        let arr = line.split('|');
        let input = [];
        let gmt = new Date(arr[3]);
        // const KR_TIME = new Date(gmt.getTime() + (9*60*60*1000));
        if(arr[2]==="/login"||arr[2]=="/logout"){
            input[0] = (arr[5]!=="{}"?JSON.parse(arr[5]).userid:"{}")
        }
        else{
            input[0] = arr[0]
        }
        input[1] = arr[1];
        input[2] = arr[2];
        input[3] = gmt.getDay();
        input[4] = gmt.getDate();
        input[5] = `${gmt.getHours()}:${gmt.getMinutes()}:${gmt.getSeconds()}`;
        input[6] = arr[4];
        if(input[0].includes("user") || input[2] === "/login" || input[2] === "/logout"){
            db.putData(sql, input)
                .then(res=>{
                    log("log",gmt,res);
                })
        }
    }
  }

let writer = new MyStream();

export {writer}