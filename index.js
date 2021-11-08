
const schedule = require('node-schedule');

let ddns = require('./ddns/ddns')


const scheduleCronstyle = ()=>{

    let rule = new schedule.RecurrenceRule()
    rule.minute = [0, 10, 20, 30, 40, 50]//每十分钟执行一次
    schedule.scheduleJob(rule, ddns.run)
}

scheduleCronstyle()





