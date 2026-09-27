const mysql=require('mysql2/promise');
let pool=null;
function configured(){return Boolean(process.env.MYSQL_HOST&&process.env.MYSQL_USER&&process.env.MYSQL_DATABASE)}
async function connect(){if(!configured())return false;try{pool=mysql.createPool({host:process.env.MYSQL_HOST,port:Number(process.env.MYSQL_PORT)||3306,user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD||'',database:process.env.MYSQL_DATABASE,waitForConnections:true,connectionLimit:5});await pool.query('SELECT 1');return true}catch(e){console.warn('MySQL unavailable; using demo data:',e.message);pool=null;return false}}
function available(){return Boolean(pool)}
async function query(sql,params=[]){if(!pool)throw new Error('Database unavailable');const [rows]=await pool.execute(sql,params);return rows}
module.exports={connect,configured,available,query};
