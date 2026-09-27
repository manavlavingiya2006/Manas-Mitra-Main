const crypto=require('node:crypto'),{promisify}=require('node:util'),store=require('./storageService');const scrypt=promisify(crypto.scrypt),sessions=new Map();
async function hash(password){let salt=crypto.randomBytes(16).toString('hex');let derived=await scrypt(password,salt,64);return salt+':'+derived.toString('hex')}
async function verify(password,stored){let [salt,expected]=stored.split(':');let derived=await scrypt(password,salt,64),buffer=Buffer.from(expected,'hex');return buffer.length===derived.length&&crypto.timingSafeEqual(buffer,derived)}
function issue(account,res){let token=crypto.randomBytes(32).toString('hex');sessions.set(token,{accountId:account.id,expires:Date.now()+8*60*60*1000});res.cookie('mm_session',token,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',maxAge:8*60*60*1000,path:'/'});return token}
function token(req){return String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('mm_session='))?.slice(11)}
function user(req){let session=sessions.get(token(req));if(!session||session.expires<Date.now())return null;return store.get('account:'+session.accountId)}
function safe(account){if(!account)return null;let {passwordHash,...u}=account;return u}
function logout(req,res){sessions.delete(token(req));res.clearCookie('mm_session',{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/'})}
function required(req,res,next){let u=user(req);if(!u)return res.status(401).json({error:'Please sign in to your care account.'});req.account=u;next()}
module.exports={hash,verify,issue,user,safe,logout,required};
