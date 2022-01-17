
var path = require('path')
var fs = require('fs')

let source_root = ''


function getSourcePath(){

    if(source_root.length > 0)
    {
        return source_root
    }

    var cmdfile = process.argv[1]
    console.log('cmd file:'+ cmdfile)
    source_root = path.dirname(cmdfile)
    return source_root
}

let logOutputFile
function getLogOutputFile(){

    if(logOutputFile != null)
    {
        return logOutputFile
    }

    logOutputFile = getSourcePath() + '/log.txt'
    return logOutputFile
}


function getCurrentTime()
{
    
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// current seconds
let millisecond = date_ob.getMilliseconds();

return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds+"."+millisecond
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

log = function logToFile(msg)
{
    let m = getCurrentTime()+ " "+msg
    console.log(m)
    fs.appendFile(getLogOutputFile(), m + '\n', function(error){
        if(error) console.log(error.message)
    })
}

module.exports = {getSourcePath, log}

