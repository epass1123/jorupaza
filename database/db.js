import { log } from "console";
import mariadb from "mariadb";
import env from "dotenv";
env.config();

const pool = mariadb.createPool({
     host: 'localhost',
     user: process.env.DBID, 
     password: process.env.DBPASS,
     connectionLimit: 5,
     port:"3306",
     database: 'db23202',
     multipleStatements:true,
});

async function setDB(DBName){
    let conn, res;
    try{
        conn = await pool.getConnection();
        res = await conn.query(`CREATE DATABASE ${DBName}`);
    } catch (err) {
		throw err
	} finally {
		if (conn) conn.release();
        console.log('created database')
	}
}

async function createTable(){
    let conn, res;
    try{
        conn = await pool.getConnection();
        res = await conn.query(
        `CREATE TABLE users (userID VARCHAR(25) NOT NULL, email VARCHAR(30) NOT NULL,regiTime DATETIME NOT NULL, useSet VARCHAR(255) NOT NULL,timestamp DATETIME, PRIMARY KEY (userID));
        `);
        res = await conn.query(
        `CREATE TABLE specification (contentsID integer(255) NOT NULL, title VARCHAR(255) NOT NULL, rawtitle VARCHAR(255), casts text, genre VARCHAR(255), jwimg VARCHAR(10), Offers VARCHAR(255), director VARCHAR(255), relConts VARCHAR(255), jwURL text, disneyURL text, wavveURL text, summary text PRIMARY KEY(contentsID));
        `);
        res = await conn.query(
        `CREATE TABLE marked_youvid (userID VARCHAR(25) NOT NULL, vID text NOT NULL, groupSet text NOT NULL, timestamp datetime NOT NULL, PRIMARY KEY(userID), FOREIGN KEY(userID) REFERENCES users(userID));
         `);
        res = await conn.query(
        `CREATE TABLE marked_channel (userID VARCHAR(25) NOT NULL, channelID text NOT NULL, title text NOT NULL, groupSet text NOT NULL, timestamp datetime NOT NULL, PRIMARY KEY(userID), FOREIGN KEY(userID) REFERENCES users(userID));
         `);
        res = await conn.query(
        `CREATE TABLE marked_ott (userID VARCHAR(25) NOT NULL, contentsID INTEGER(255), ottID text NOT NULL, title text NOT NULL, img text, url text, groupSet text NOT NULL, timestamp datetime NOT NULL, PRIMARY KEY(userID), FOREIGN KEY(userID) REFERENCES users(userID));
         `);
        res = await conn.query(
        `CREATE TABLE marked_streamer (userID VARCHAR(25) NOT NULL, streamerID text NOT NULL, groupSet text NOT NULL, timestamp datetime NOT NULL, PRIMARY KEY(userID), FOREIGN KEY(userID) REFERENCES users(userID));
         `);
        res = await conn.query(
        `CREATE TABLE admin (adminID VARCHAR(15) NOT NULL, pw VARCHAR(20) NOT NULL, permission VARCHAR(30) NOT NULL, timestamp DATETIME NOT NULL, PRIMARY KEY(adminID));
         `);
        res = await conn.query(
        `CREATE TABLE admin_session (sessionID VARCHAR(25) NOT NULL, adminID VARCHAR(30) NOT NULL, isValid BOOL NOT NULL, PRIMARY KEY(sessionID), FOREIGN KEY(adminID) REFERENCES admin(adminID));
         `);
        res = await conn.query(
        `CREATE TABLE user_behavior (logID INTEGER(255) NOT NULL, userID VARCHAR(20) NOT NULL, url VARCHAR(30) NOT NULL, event_type VARCHAR(10) NOT NULL, event_target VARCHAR(255) NOT NULL, timestamp datetime NOT NULL, PRIMARY KEY(logID), FOREIGN KEY(userID) REFERENCES users(userID));
        `);
        res = await conn.query(
        `CREATE TABLE logs (ID varchar(255) NOT NULL, userID VARCHAR(255) not null, url VARCHAR(20) NOT NULL, url VARCHAR(255) NOT NULL, method VARCHAR(10) NOT NULL, day VARCHAR(20) NOT NULL, date VARCHAR(20) NOT NULL, time VARCHAR(255) not null, resCode VARCHAR(10) not null, PRIMARY KEY(ID));
        `);
    
    } catch (err) {
		throw err
	} finally {
		if (conn) conn.release();
        console.log('created Table')
	}
}

async function getData(query, inputs) {
    let conn, rows;
	try {
        conn = await pool.getConnection();
		rows = await conn.query(query,inputs);
	} catch (err) {
		log(err);
	} finally {
		if (conn) conn.release();
        return rows
	}
}

async function chkUser(id) {
    let conn, rows;
	try {
        conn = await pool.getConnection();
		rows = await conn.query(`SELECT userid FROM users WHERE userID=?`,id);
	} catch (err) {
		throw err
	} finally {
		if (conn) conn.release();
        return rows
	}
}

async function putData(query,values){
    let conn, rows;
	try {
        conn = await pool.getConnection();
		rows = await conn.query(query,values);
	} catch (err) {
		log(err);
	} finally {
        // log(query, values);
		if (conn) conn.release();
        return rows
	}
}


export {getData,setDB,createTable, putData, chkUser};
