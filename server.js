var
  ws = require('ws').Server,
  websocket = require('websocket-stream'),
  responder = require('./responder'),
  wss = new ws({port: 4567})

wss.on('connection', function(ws)
{
  ws = websocket(ws)
  ws.pipe(responder()).pipe(ws)
})
