var
  net = require('net')
  ws = require('ws').Server,
  websocket = require('websocket-stream'),

new ws({port: 4567})
.on('connection', function(ws)
{
  var
    ssh = net.connect(22, '10.220.6.10')
  ssh
  .on('error', Err)
  .on('connect', Start)

  function Err()
  {
    ws.close()
  }

  function Start()
  {
    this.pipe(websocket(ws)).pipe(this)
  }
})
