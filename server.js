var
  ws = require('ws').Server,
  websocket = require('websocket-stream'),
  responder = require('./responder'),
  wss = new ws({port: 4567})

wss.on('connection', function(ws)
{
  console.log('Connected')
  ws = websocket(ws)
  ws.write('Hello\n')
  ws.pipe(responder()).pipe(ws)
})
