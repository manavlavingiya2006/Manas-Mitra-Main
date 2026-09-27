const tasks=[['08:00','Morning Medicine','💊'],['10:00','Morning Walk','🚶'],['12:30','Lunch','🍛'],['15:00','Memory Game','🧠'],['17:00','Call Priya','📞'],['20:00','Evening Medicine','💊']].map((x,i)=>({id:i+1,patientId:1,time:x[0],title:x[1],icon:x[2],status:'pending',repeat:'Daily',priority:'Normal',active:true}));
const memories=[{id:1,patientId:1,title:'A trip to Manali',description:'You visited Manali with your family in 2019.',category:'Places',date:'2019',icon:'🏔️'},{id:2,patientId:1,title:'Your daughter Priya',description:'Priya lives nearby and you enjoy talking in the evening.',category:'Family',date:'A favorite connection',icon:'👨‍👩‍👧'}];
const patient={id:1,name:'Arun',preferredName:'Arun',age:72,caregiver:'Priya',language:'en'};
const settings={1:{language:'en',theme:'system',font:'medium'}};
const contacts={1:[]};
const emergencyEvents=[];
module.exports={tasks,memories,patient,settings,contacts,emergencyEvents};
