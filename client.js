var
  ws = require('ws'),
  path = require('path')

if(process.argv.length!=3)
{
  console.info('Websocket netcat.')
  console.info(
    'Usage:',
    path.basename(process.argv[0]),
    path.basename(__filename),
    'ws[s]://host[:port]/uri'
  )
  process.exit(1)
}

var
  client = new ws(process.argv[2])

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
