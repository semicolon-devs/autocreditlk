var fs = require('fs');
var nodemailer = require('nodemailer');
var events = require('events');
var moment = require('moment')

const date_time = moment().format("MMM Do YY");  
const fileName = date_time + ' - Auto Credit Daily Report' +'.xlsx';

//setup email

var check =1;
var events = new events.EventEmitter();
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "morning123lucifer@gmail.com",
        pass: "ypgdraaoruolsgek"
    }
});

function inputmail(){
    ///////Email
    const from = 'Auto Credit<morning123lucifer@gmail.com>';
    const to  = 'hasankasanjana.dev@gmail.com';
    const subject  = date_time + ' - Auto Credit Daily Report';
    const text = 'File Attached for :' + date_time;
    const html = '';
    var mailOption = {
        from: from,
        to:  to,
        subject: subject,
        text: text,
        html: html,
        attachments: [{
            filename: fileName,
            path: fileName
        }]
    }
    return mailOption;
}
function send(){
        smtpTransport.sendMail(inputmail(),function(err,success){
        if(err){
            events.emit('error', err);
        }
        if(success){
            events.emit('success', success);
        }
    });
}



//fetch today entries from db

// var start = new Date();
// start.setHours(0,0,0,0);

// var end = new Date();
// end.setHours(23,59,59,999);

// var todayJSN = db.posts.find({created_on: {$gte: start, $lt: end}});

// fetch(url)
//   .then(function(res) {
//     // handle the response
//   })
//   .catch(function(err) {
//     // handle the error
//   });



var jsn = [{
    "name": "Nilesh",
    "id": "RDTC",
    "collector":"A",
    "amount": "1000"
   },{
    "name": "Nilesh",
    "id": "RDTC",
    "collector":"B",
    "amount": "2000"
   },{
    "name": "Nilesh",
    "id": "RDTC",
    "collector":"B",
    "amount": "3000"
 }];

var data='DAILY REPORT' + '\n' +
         'Auto Credit' + '\n' +
         date_time+ '\n' + '\n' 
;

let total_A = 0;
let total_B = 0;
let total_C = 0;

for (var i = 0; i < jsn.length; i++) {
    
    if(jsn[i].collector == 'A'){
        total_A += Number(jsn[i].amount);
    }else if(jsn[i].collector == 'B'){
        total_B += Number(jsn[i].amount);
    }else{
        total_C += Number(jsn[i].amount);
    }

    data=data+jsn[i].id+'\t'+jsn[i].name+'\t'+jsn[i].collector+'\t'+jsn[i].amount+'\n';
 }

data = data + '\n' +'\n' + '\n' ;
data = data + "Collected Amount by A" +'\t'+ total_A + '\n';
data = data + "Collected Amount by B" +'\t'+ total_B + '\n';
data = data + "Collected Amount by C" +'\t'+ total_C + '\n';


fs.writeFile( (date_time + ' - Auto Credit Daily Report' +'.xlsx'), data, (err) => {
    if (err) throw err;
    console.log('File created');

    //send email
    send();
    events.on("error", function(err){
        console.log("Mail not send");
        if(check<10)
        send();
        check++;
    });
    events.on("success", function(success){
        console.log("Mail send");
    });
 
});


