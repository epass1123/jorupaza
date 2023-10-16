import { log } from 'console';
import fs from 'fs';
import * as db from './db.js'

// const text = fs.readFileSync("../jw_contents_links.txt");
// let texts = text.toString().split('\n');
// let jw_contents_links = []
// for(let i in texts){
//     jw_contents_links.push(texts[i].split("|"));
// }
let resultList = [];
const csv = fs.readFileSync("./offerlinks.csv");
let links = csv.toString().split('\n');
let offerlinks = []
for(let i in links){
    offerlinks.push(links[i].split("|"));
}


let title = "";
let i = 0;
for(let k of offerlinks){
    if(title === k[0] && resultList[i-1].length !== 0){
        resultList[i-1].push(k[3]);
    }
    else{
        resultList.push(k)
        title = k[0];
        ++i
    }
}
// log(resultList);
let inputs = [];
// log(resultList);
for(let i in resultList){
    let a = [];
    a[0] = i;
    a[1] = resultList[i][0];
    a[2]=[];
    a[3]=[];
    a[4]=[];
    for(let k in resultList[i]){
        // log(resultList[i][k]);
        if(resultList[i][k].includes("disneyplus")){
            a[2].push("disneyplus")
            a[3] = resultList[i][k]
        }
        else if(resultList[i][k].includes("wavve")){
            a[2].push("wavve")
            a[4] = resultList[i][k]
        }
        // else if(resultList[i][k].includes("netflix")){
        //     // if(a[2])
        //     a[2].push("netflix")
        // }
    }
    inputs.push(a)
}
// log(inputs);

let sql = `INSERT INTO specification (contentID ,title,Offers,disneyURL,wavveURL) VALUES (?,?,?,?,?)`;
// log(offerlinks[0])
db.putData(sql,inputs)
    .then(res=>{
        log(res);
});