import { log } from 'console';
import fs from 'fs';
import * as db from '../database/db.js'

const csv = fs.readFileSync("crawled.txt");
let links = csv.toString().split('\n');


const csv2 = fs.readFileSync("jw_contents.txt");
let links2 = csv2.toString().split('\n');

let inputs = []
let obj;
let sql = `INSERT INTO specification (contentsID ,title, rawtitle, casts, genre, Offers, director, summary) VALUES (?,?,?,?,?,?,?,?)`;

async function store(res,req){
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
            obj.contentsID = i[0].split(',')[0];
            obj.title = i[0].split(',')[1];
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
    
    
 
   

}

export{store};