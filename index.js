
const schedule = require('node-schedule');

let ddns = require('./ddns/ddns')

let utils = require('./utils')


const scheduleCronstyle = ()=>{

    let rule = new schedule.RecurrenceRule()
    rule.minute = [0, 10, 20, 30, 40, 50]//每十分钟执行一次
    schedule.scheduleJob(rule, ddns.run)
}


// process.argv.forEach(function(val, index, array){
//     console.log(index + ':' + val)
// })
utils.log('start schedule')
scheduleCronstyle()
// ddns.run()






