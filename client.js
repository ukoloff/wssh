var
  ws = require('ws'),
  client = new ws('wss://grid.plugingrid.com/ssh')

client.on('open', function()
{
  process.stdin
  .on('readable', Read)
  .on('end', Close)
  .on('error', Close)
  client
  .on('message', Msg)
  .on('close', Close)
})

function Read()
{
  var x
  while(null!=(x=this.read()))
    client.send(x)
}

function Msg(data)
{
  process.stdout.write(data)
}

function Close()
{
  process.exit()
}
