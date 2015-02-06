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

  function Hosts(err, yml)
  {
    if(err)
    {
      Err(err)
      return
    }
    try
    {
      net.connect(22, findHost(ws.upgradeReq.url, yml))
      .on('error', Err)
      .on('connect', Start)
    }
    catch(e)
    {
      Err(e)
    }
  }

  function Err(e)
  {
    ws.send('Oops:'+e)
    ws.close()
  }

  function Start()
  {
    this.pipe(websocket(ws)).pipe(this)
  }
})

function findHost(url, yml)
{
  // Load YAML
  yml = yaml.safeLoad(yml)
  // Clean URL
  url = String(url)
  .split(/[^-.\w]+/)
  .filter(id)
  .filter(goodHost)
  .reverse()[0]
  if(url in yml)
  {
    var host = yml[url]
    if(!host) throw Error('Invalid host')
    return true===host ? url : host
  }
}

function id(x)
{
  return x
}

function goodHost(h)
{
  return !h.match(/^[-_.]|[-_.]$/)
}
