import { log } from 'console';
import fs from 'fs';
import db from 'database/db.js'

const text = fs.readFileSync("jw_contents_links.txt");
let texts = text.toString().split('\n');
let jw_contents_links = []
for(let i in texts){
    jw_contents_links.push(texts[i].split("|"));
}
log(jw_contents_links)
