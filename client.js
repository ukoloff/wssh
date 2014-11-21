var
  ws = require('ws'),
  client = new ws('ws://localhost:4567/ssh')

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
  client.send(this.read())
}

function Msg(data)
{
  process.stdout.write(data)
}

function Close()
{
  process.exit()
}
