const https = require('https')
const http = require("http");

const port = 8084

const fs =require('fs')
const path = require('path')

const server = http.createServer((req, res) =>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')

    var result = ''

    result += fs.readdirSync('./').map(fileName=>{
        return path.join('/', fileName)
    })

    result += '\n'


    // try {
    //     const data = fs.readFileSync('./ddns.js', 'utf8')
    //     console.log(data)
    //     result += data
    // } catch (err) {
    //     console.error(err)
    // }


    res.end('hello world\n '+result)
})

server.listen(port, ()=>{
    console.log('server is runing in '+port)
})