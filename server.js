import express from "express";
import bodyParser from 'body-parser'
import {log} from "console";
import env from "dotenv";
env.config();
import session from "express-session";
import MySQLStore from "express-mysql-session";
import morgan from "morgan";
import morganBody from "morgan-body";
import {writer} from "./utils/writeable.js"

import path from 'path';
const __dirname = path.resolve();
const mySQLStore = MySQLStore(session);

import indexRouter from "./routes/index.js"
// import mypageRouter from "./routes/user/index.js";
import managerRouter from "./routes/manage/index.js"

//BigInt json.stringify typeerror 해결
BigInt.prototype.toJSON = function () {
    return this.toString();
  };

var options = {
    host: "localhost",
    user: process.env.DBID, 
    password: process.env.DBPASS,
    port:"3306",
    database: "db23202",
  };

var sessionStore = new mySQLStore(options);

let app = express();
// express 는 함수이므로, 반환값을 변수에 저장한다.

//middleware

// 백엔드 로그 남기기
// morganBody(app);

morgan.token('body', (req, res) => JSON.stringify(req.body));
morgan.token('param', (req, res) => JSON.stringify(req.params));
app.use(morgan(':param|:method|:url|:date[web]|:status|:body|', {stream: writer}));
app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const maxAge = 1000 * 60 * 20;

app.use(session({
    cookie: {
        path: '/',
        maxAge,
      },
    store: sessionStore,
    resave: false,
    secret: 'kong',
    saveUninitialized: true,
}));

app.use("/", indexRouter);
app.use("/", managerRouter);

app.listen(process.env.PORT, function() {
    log(`express server on port ${process.env.PORT}`)
});
