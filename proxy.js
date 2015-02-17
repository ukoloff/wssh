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
  net = require('net')

net.createServer(Req)
.listen(8022, On)

function On()
{
  log('Proxy started')
}

function Req(conn)
{
  log('Client connected')
}

function log()
{
  var
    d = new Date()
    console.info.apply(
      console,
      ['['+d.toISOString().replace('T', ' ').replace(/Z$/, '')
          +d.toTimeString().split(/\s+/)[1].replace(/^\w+/, ' ')+']']
      .concat([].slice.call(arguments)))
}
