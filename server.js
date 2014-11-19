var
  ws = require('ws').Server,
  wss = new ws({port: 4567})

wss.on('connection', function(ws)
{
  ws.on('message', function(message)
  {
    console.log('received: %s', message)
  });
  ws.send('something')
})
