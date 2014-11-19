var
  WebSocket = require('ws')
  ws = new WebSocket('ws://localhost:4567/ssh')

ws.on('open', function()
{
  console.log('connected')
  ws.send(new Date().toString())
})

ws.on('close', function()
{
  console.log('disconnected')
})

ws.on('message', function(data, flags)
{
  console.log('Got:', data, flags);
  setTimeout(function()
  {
      ws.send(new Date().toString())
  }, 500)
})
