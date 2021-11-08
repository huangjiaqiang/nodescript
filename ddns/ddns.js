

const https = require('https')
const fs = require('fs')

const readXml = require('xmlreader');
const path = require("path");

let apiKey = ''
let baseHost = ''
let rrhost = ''

readXml.read(fs.readFileSync('./ddns/config.xml', 'utf8'), (err, respon)=>{
    baseHost = respon.root.domain.text()
    apiKey = respon.root.apikey.text()
    rrhost = respon.root.rrhost.text()
    if (rrhost == null)
    {
        throw Error('not set rrhost')
    }
    console.log('read config:'+"apikey="+apiKey)
    console.log('read config:'+"basehost="+baseHost)
    console.log('read config:'+"rrhost="+rrhost)
})

const saveIpFile = './ip'



function run(){
    console.log('ddns')

    let hostName = baseHost
    hostName = rrhost + "." + baseHost
    console.log(hostName)

    let url = 'https://www.namesilo.com/api/dnsListRecords?version=1&type=xml&key=' + apiKey + '&domain=' + baseHost
    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data);
            readXml.read(data, (err, xmlResp)=>{
                if (null !== err)
                {
                    console.log(err)
                    return
                }
                let localip = xmlResp.namesilo.request.ip.text()
                console.log('local ip ='+localip)
                console.log('local ip file path '+path.resolve(saveIpFile))
                if (fs.existsSync(saveIpFile))
                {
                    let oldip = fs.readFileSync(saveIpFile, 'utf8')
                    if (oldip === localip)
                    {
                        return;
                    }
                }

                xmlResp.namesilo.reply.resource_record.array.forEach(item => {
                    if (typeof item == 'object')
                    {
                        if (item.type.text() === 'A')
                        {
                            // console.log(item.host.text())
                            let host = item.host.text()
                            if (host === hostName)
                            {

                                let recordId = item.record_id.text()
                                let rrhost = host.replace('.'+baseHost, '')
                                rrhost = rrhost.replace(baseHost, '')
                                console.log('Do dns upgrade: ' + host + ' rrhost =' + rrhost)
                                updateRecord(recordId, rrhost, localip, result=>{

                                    if (result)
                                    {
                                        fs.writeFileSync(saveIpFile, localip)
                                        console.log('update success:'+ host + '=' + localip)
                                    }
                                })
                            }
                        }


                    }
                })

            })

        });
    }).on('error', (err => {
        console.log("Error: "+err.message)
    }))

}

/**
 * 更新域名
 * @param rrid 唯一id
 * @param rrhost 需要更新的域名
 * @param ip
 */
function updateRecord(rrid, rrhost, ip, onResult)
{
    let url = 'https://www.namesilo.com/api/dnsUpdateRecord?version=1&type=xml&key=' + apiKey + '&domain=' + baseHost + '&rrid=' + rrid + '&rrhost=' + rrhost + '&rrvalue=' + ip + '&rrttl=7207'
    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data);
            readXml.read(data, (err, xmlResp)=>{
                if (null !== err)
                {
                    console.log(err)
                    onResult(false)
                    return
                }

                let code = xmlResp.namesilo.reply.code.text()
                if (code == '300')
                {
                    onResult(true)
                }else
                {
                    console.log('update fail: code ='+ code)
                }
            })

        });
    }).on('error', (err => {
        console.log("Error: "+err.message)
        onResult(false)
    }))
}

module.exports ={run}




