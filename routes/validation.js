function id(value){const n=Number(value);return Number.isSafeInteger(n)&&n>0?n:null}
function clean(value,max=120){return typeof value==='string'?value.trim().slice(0,max):''}
function task(body={}){let title=clean(body.title,90),time=clean(body.time,5);if(!title||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return null;return {title,time,icon:clean(body.icon,5)||'◯',status:['pending','done','snoozed','missed'].includes(body.status)?body.status:'pending',repeat:['Daily','Weekly','Once'].includes(body.repeat)?body.repeat:'Daily',priority:body.priority==='High'?'High':'Normal',active:body.active!==false,completedAt:body.completedAt||null}}
function memory(body={}){let title=clean(body.title,100),description=clean(body.description,700);if(!title||!description)return null;return {title,description,category:clean(body.category,35)||'Personal Stories',date:clean(body.date,50),icon:clean(body.icon,5)||'📝'}}
module.exports={id,clean,task,memory};
