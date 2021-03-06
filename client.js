//
// WSSH client
//
// Cannot be run as a child on Windows (bug with stdio), only testing there
//
if(process.argv.length!=3)
{
  var
    path = require('path')

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
  ws = require('ws'),
  buf = [],
  client = new ws(process.argv[2])

process.stdin
.on('readable', stdioRead)
.on('end', Close)
.on('error', Close)

client
.on('open', wsOpen)
.on('message', wsMsg)
.on('close', Close)
.on('error', Close)

function stdioRead()
{
  var x
  while(null!=(x=this.read()))
    if(buf)
      buf.push(x)
    else
      client.send(x)
}

function wsOpen()
{
  buf.forEach(function(data){ client.send(data) })
  buf = null
}

function wsMsg(data)
{
  process.stdout.write(data)
}

function Close()
{
  process.exit()
}
