import { log } from 'console';
import fs from 'fs';
import * as db from '../database/db.js'

const csv2 = fs.readFileSync("jw_contents.txt");
let links2 = csv2.toString().split('\n');


async function store(req,res){
    let inputs = []
    let obj;
    let sql = `INSERT INTO specification (contentsID ,title, rawtitle, casts, genre, Offers, director, summary) VALUES (?,?,?,?,?,?,?,?)`;
    try{
        for(let i of links2){
            i = i.split('|');
            obj = {
                contentsID:null,
                title:null,
                rawtitle:null,
                "평점":null,
                "장르":null,
                "재생 시간":null,
                "연령 등급":null,
                " Production country ":null,
                "감독":null,
                summary:null,
                casts:null,
                offers:null,
            }
            if(i[0] !== ""){
                let split = i[0].split(',')
                if(split.length > 2){
                    obj.contentsID = split.shift();
                    obj.title = split.join(',');
                }else{
                    obj.contentsID = i[0].split(',')[0];
                    obj.title = i[0].split(',')[1];
                }
                obj.rawtitle = i[1];
                for(let k of i.slice(2,-3)){
                    
                    if(k.includes(":")){
                        k = k.split(":");
                        obj[k[0]] = k[1];
                    }
            
                }
                obj.offers = i.pop().slice(0,-1);
                obj.casts = i.pop();
                obj.summary = i.pop();
                
                inputs = [obj.contentsID, obj.title, obj.rawtitle, obj.casts, obj["장르"],obj.offers, obj["감독"],obj.summary]
                db.putData(sql,inputs)
                .then(rows=>{
                });
            }        
        }
        res.status(200).json({
            "content-type": "json",
            "result_code": 200,
            "result_req": "post done"
        });
    }catch(err){
        log(err);
        res.status(400).json({
            "content-type": "json",
            "result_code": 400,
            "result_req": "bad request"
        });
    }
    
}

const csv = fs.readFileSync("crawled.txt");
let links = csv.toString().split('\n');

async function jwlinks(req,res){
    let inputs = [];

    let query = `insert into specification (contentsID, jwURL) values(?,?) ON DUPLICATE KEY UPDATE jwURL=VALUES(jwURL)`
    try{
        for(let i of links){
            if(i.split(',')[0] !== "0" && i.split(',')[1] !== undefined && i.split(',')[0] !== ''){
                let contentsID = i.split(',')[0];
                let jwURL = i.split(',')[1];
                
                inputs = [contentsID, jwURL]
                db.putData(query,inputs)
                .then(rows=>{
                });       
            }
        }
        res.status(200).json({
            "content-type": "json",
            "result_code": 200,
            "result_req": "post done"
        });
    }catch(err){
        log(err);
        res.status(400).json({
            "content-type": "json",
            "result_code": 400,
            "result_req": "bad request"
        });
    }
}

const csv3 = fs.readFileSync("offerlinks.csv");
let links3 = csv3.toString().split("\n");

async function wdLinks(req,res){
    let query = "";
    try{
        for(let i in links3){
            let title = links3[i].split('|').shift();
            let url = links3[i].split('|').pop().slice(0, -1);
            if(url.includes("disney")){
                query = `UPDATE specification SET disneyURL=? WHERE title=?`
            }
            else if(url.includes("wavve")){
                query = `UPDATE specification SET wavveURL=? WHERE title=?`
            }
            else{
                continue;
            }
    
            db.updateData(query,[url,title])
                .then(rows=>{
            });
        }
        res.status(200).json({
            "content-type": "json",
            "result_code": 200,
            "result_req": "post done"
        });
    }catch(err){
        log(err);
        res.status(400).json({
            "content-type": "json",
            "result_code": 400,
            "result_req": "bad request"
        });
    }


}


export{store, jwlinks, wdLinks};