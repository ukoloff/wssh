var
  websocket = require('websocket-stream'),
  ws = require('ws')
  client = new ws('ws://localhost:4567/ssh')

client.on('open', Open)

function Open()
{
  console.log('OPEN')
  // var z = websocket(client)
  process.stdin.on('readable', Read)
  client.on('message', Msg)
}

function Read()
{
  console.log('SEND')
  client.send(this.read())
}

function Msg(data)
{
  process.stdout.write(data)
}
