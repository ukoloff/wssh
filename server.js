var
  fs = require('fs'),
  net = require('net')
  ws = require('ws').Server,
  websocket = require('websocket-stream'),
  yaml = require('js-yaml')

new ws({port: 4567})
.on('connection', function(ws)
{
  fs.readFile(__dirname+'/hosts.yml', Hosts)
  net.connect(22, '10.220.6.10')
  .on('error', Err)
  .on('connect', Start)

  function Hosts(err, yml)
  {
    if(err)
    {
      ws.send('Oops: '+err)
      ws.close()
    }
    try
    {
      var hosts = yaml.safeLoad(yml)
      console.log('Connect', ws.upgradeReq.url)
    }
    catch(e)
    {
      ws.send('Oops: '+e)
      ws.close()
    }
  }

  function Err()
  {
    ws.close()
  }

  function Start()
  {
    this.pipe(websocket(ws)).pipe(this)
  }
})
